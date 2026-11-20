import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument, MessageDirection } from './schemas/conversation.schema';
import { Message, MessageAttachment, MessageDocument, MessageStatus } from './schemas/message.schema';
import { Workspace, WorkspaceDocument } from '../workspaces/schemas/workspace.schema';
import {
  SocialAccount,
  SocialAccountDocument,
  SocialAccountStatus,
  SocialPlatform,
} from '../social-accounts/schemas/social-account.schema';
import { SocialAccountsService } from '../social-accounts/social-accounts.service';
import { NotificationsService } from '../notifications/notifications.service';
import { FacebookClient } from '../../providers/social/facebook/facebook.client';
import { FacebookGraphError } from '../../providers/social/facebook/facebook.errors';
import { decryptToken } from '../../common/utils';
import { ListConversationsDto, ListMessagesDto } from './dto';
import { MessengerAttachmentPayload, MessengerEvent } from './facebook-webhook.types';

/** Messenger standard messaging window. */
export const MESSENGER_REPLY_WINDOW_MS = 24 * 60 * 60 * 1000;

export interface IngestResult {
  stored: boolean;
  duplicate: boolean;
  conversationId?: string;
}

interface NormalizedMessage {
  participantId: string;
  direction: MessageDirection;
  senderId: string;
  recipientId: string;
  mid: string | null;
  text: string;
  attachments: MessageAttachment[];
  sentAt: Date;
}

function isDuplicateKeyError(error: any): boolean {
  return error?.code === 11000;
}

function toObjectId(id: string, label: string): Types.ObjectId {
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`Invalid ${label}.`);
  }
  return new Types.ObjectId(id);
}

export function previewText(text: string, attachments: MessageAttachment[]): string {
  if (text && text.trim()) return text.trim().slice(0, 140);
  if (attachments.length > 0) {
    const type = attachments[0].type;
    if (type === 'image') return '📷 Sent a photo';
    if (type === 'video') return '🎥 Sent a video';
    if (type === 'audio') return '🎤 Sent a voice message';
    if (type === 'sticker') return '👍 Sent a sticker';
    return '📎 Sent an attachment';
  }
  return '';
}

@Injectable()
export class InboxService {
  private readonly logger = new Logger(InboxService.name);

  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Workspace.name) private readonly workspaceModel: Model<WorkspaceDocument>,
    @InjectModel(SocialAccount.name) private readonly socialAccountModel: Model<SocialAccountDocument>,
    private readonly socialAccountsService: SocialAccountsService,
    private readonly notificationsService: NotificationsService,
    private readonly facebookClient: FacebookClient,
  ) {}

  // ───────────────────────────── Access control ─────────────────────────────

  private async assertWorkspaceAccess(workspaceId: string | Types.ObjectId, userId: string): Promise<void> {
    const userObjectId = toObjectId(userId, 'user id');
    const workspace = await this.workspaceModel.exists({
      _id: typeof workspaceId === 'string' ? toObjectId(workspaceId, 'workspace id') : workspaceId,
      $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
      isDeleted: false,
    });
    if (!workspace) throw new ForbiddenException('Workspace access denied.');
  }

  private async getConversationForUser(conversationId: string, userId: string): Promise<ConversationDocument> {
    const conversation = await this.conversationModel.findById(toObjectId(conversationId, 'conversation id'));
    if (!conversation) throw new NotFoundException('Conversation not found.');
    await this.assertWorkspaceAccess(conversation.workspaceId, userId);
    return conversation;
  }

  // ───────────────────────────── Webhook ingestion ─────────────────────────────

  private normalizeAttachments(raw?: MessengerAttachmentPayload[]): MessageAttachment[] {
    return (raw || []).map((a) => ({
      type: a.payload && 'sticker_id' in a.payload && a.payload.sticker_id ? 'sticker' : a.type || 'file',
      url: a.payload?.url,
      name: a.title || a.payload?.title,
    }));
  }

  private normalizeEvent(pageId: string, event: MessengerEvent): NormalizedMessage | null {
    const sentAt = new Date(event.timestamp || Date.now());

    if (event.message) {
      const isEcho = event.message.is_echo === true || event.sender?.id === pageId;
      return {
        participantId: isEcho ? event.recipient.id : event.sender.id,
        direction: isEcho ? MessageDirection.OUTBOUND : MessageDirection.INBOUND,
        senderId: event.sender.id,
        recipientId: event.recipient.id,
        mid: event.message.mid || null,
        text: event.message.text || '',
        attachments: this.normalizeAttachments(event.message.attachments),
        sentAt,
      };
    }

    if (event.postback) {
      // Button taps (e.g. "Get Started") show up in the thread as what the user tapped.
      return {
        participantId: event.sender.id,
        direction: MessageDirection.INBOUND,
        senderId: event.sender.id,
        recipientId: event.recipient.id,
        mid: event.postback.mid || null,
        text: event.postback.title || event.postback.payload || '',
        attachments: [],
        sentAt,
      };
    }

    return null; // delivery / read receipts and other event types are not stored
  }

  /**
   * Stores one Messenger webhook event for a connected Facebook Page account.
   * Idempotent: Meta retries deliveries and echoes our own sends, both are de-duplicated by `mid`.
   */
  async ingestMessengerEvent(account: SocialAccountDocument, event: MessengerEvent): Promise<IngestResult> {
    const normalized = this.normalizeEvent(account.platformAccountId, event);
    if (!normalized || !normalized.participantId) return { stored: false, duplicate: false };

    if (normalized.mid && (await this.messageModel.exists({ platformMessageId: normalized.mid }))) {
      return { stored: false, duplicate: true };
    }

    const conversation = await this.conversationModel.findOneAndUpdate(
      { socialAccountId: account._id, participantId: normalized.participantId },
      {
        $setOnInsert: {
          workspaceId: account.workspaceId,
          socialAccountId: account._id,
          platform: account.platform,
          participantId: normalized.participantId,
          unreadCount: 0,
        },
      },
      { upsert: true, new: true },
    );

    try {
      await this.messageModel.create({
        conversationId: conversation._id,
        workspaceId: account.workspaceId,
        socialAccountId: account._id,
        platform: account.platform,
        platformMessageId: normalized.mid,
        direction: normalized.direction,
        senderId: normalized.senderId,
        recipientId: normalized.recipientId,
        text: normalized.text,
        attachments: normalized.attachments,
        status: normalized.direction === MessageDirection.INBOUND ? MessageStatus.RECEIVED : MessageStatus.SENT,
        sentAt: normalized.sentAt,
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) return { stored: false, duplicate: true, conversationId: conversation._id.toString() };
      throw error;
    }

    const preview = previewText(normalized.text, normalized.attachments);
    const isNewer = !conversation.lastMessageAt || normalized.sentAt >= conversation.lastMessageAt;
    const update: Record<string, any> = {};
    if (isNewer) {
      update.$set = {
        lastMessageText: preview,
        lastMessageAt: normalized.sentAt,
        lastMessageDirection: normalized.direction,
      };
    }
    if (normalized.direction === MessageDirection.INBOUND) {
      update.$inc = { unreadCount: 1 };
      if (!conversation.lastInboundAt || normalized.sentAt > conversation.lastInboundAt) {
        update.$set = { ...(update.$set || {}), lastInboundAt: normalized.sentAt };
      }
    }
    if (Object.keys(update).length > 0) {
      await this.conversationModel.updateOne({ _id: conversation._id }, update);
    }

    if (!conversation.participantName) {
      await this.enrichParticipant(account, conversation);
    }

    if (normalized.direction === MessageDirection.INBOUND) {
      await this.notifyInboundMessage(account, conversation, preview);
    }

    return { stored: true, duplicate: false, conversationId: conversation._id.toString() };
  }

  /** Best-effort lookup of the sender's name/avatar (requires pages_messaging). */
  private async enrichParticipant(account: SocialAccountDocument, conversation: ConversationDocument): Promise<void> {
    if (account.platform !== SocialPlatform.FACEBOOK || !account.accessTokenEncrypted) return;
    try {
      const profile = await this.facebookClient.getMessengerUserProfile(
        conversation.participantId,
        decryptToken(account.accessTokenEncrypted),
      );
      if (!profile) return;
      const name = profile.name || [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
      if (!name && !profile.profile_pic) return;
      conversation.participantName = name || conversation.participantName;
      conversation.participantAvatarUrl = profile.profile_pic || conversation.participantAvatarUrl;
      await this.conversationModel.updateOne(
        { _id: conversation._id },
        { $set: { participantName: conversation.participantName, participantAvatarUrl: conversation.participantAvatarUrl } },
      );
    } catch (error: any) {
      this.logger.debug(`Could not enrich Messenger participant ${conversation.participantId}: ${error.message}`);
    }
  }

  private async notifyInboundMessage(
    account: SocialAccountDocument,
    conversation: ConversationDocument,
    preview: string,
  ): Promise<void> {
    const who = conversation.participantName || 'Someone';
    try {
      await this.notificationsService.sendGroupedNotification({
        userId: account.userId.toString(),
        workspaceId: account.workspaceId.toString(),
        title: `New Messenger message from ${who}`,
        message: `${account.accountName}: ${preview || 'New message'}`,
        type: 'info',
        category: 'inbox',
        link: `/user/inbox?conversation=${conversation._id}`,
        groupKey: `messenger:${conversation._id}`,
      });
    } catch (error: any) {
      this.logger.warn(`Failed to create inbox notification: ${error.message}`);
    }
  }

  // ───────────────────────────── Dashboard API ─────────────────────────────

  async listConversations(userId: string, dto: ListConversationsDto) {
    await this.assertWorkspaceAccess(dto.workspaceId, userId);
    const workspaceObjectId = toObjectId(dto.workspaceId, 'workspace id');

    // Only show threads of accounts that are still connected.
    const accounts = await this.socialAccountModel
      .find({ workspaceId: workspaceObjectId, isDeleted: false, platform: SocialPlatform.FACEBOOK })
      .select('_id accountName platform profilePictureUrl status metadata')
      .lean();
    const accountIds = accounts.map((a) => a._id);

    const query: Record<string, any> = { workspaceId: workspaceObjectId, socialAccountId: { $in: accountIds } };
    if (dto.accountId) {
      const accountObjectId = toObjectId(dto.accountId, 'account id');
      query.socialAccountId = accountIds.some((id) => id.equals(accountObjectId)) ? accountObjectId : { $in: [] };
    }
    if (dto.search) {
      const safe = dto.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { participantName: { $regex: safe, $options: 'i' } },
        { lastMessageText: { $regex: safe, $options: 'i' } },
      ];
    }

    const page = dto.page || 1;
    const limit = dto.limit || 30;

    const [conversations, total] = await Promise.all([
      this.conversationModel
        .find(query)
        .sort({ lastMessageAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.conversationModel.countDocuments(query),
    ]);

    const accountById = new Map(accounts.map((a) => [a._id.toString(), a]));
    const now = Date.now();

    return {
      data: conversations.map((c) => {
        const account = accountById.get(c.socialAccountId.toString());
        return {
          ...c,
          canReply: !!c.lastInboundAt && now - new Date(c.lastInboundAt).getTime() < MESSENGER_REPLY_WINDOW_MS,
          account: account
            ? {
                _id: account._id,
                accountName: account.accountName,
                platform: account.platform,
                profilePictureUrl: account.profilePictureUrl,
                status: account.status,
              }
            : null,
        };
      }),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      accounts: accounts.map((a) => ({
        _id: a._id,
        accountName: a.accountName,
        platform: a.platform,
        profilePictureUrl: a.profilePictureUrl,
        status: a.status,
        messagingEnabled: a.metadata?.webhooksSubscribed === true,
        messagingIssue:
          a.metadata?.webhookError ||
          (Array.isArray(a.metadata?.missingMessagingPermissions) && a.metadata.missingMessagingPermissions.length > 0
            ? `Missing permissions: ${a.metadata.missingMessagingPermissions.join(', ')}`
            : null),
      })),
    };
  }

  async getMessages(userId: string, conversationId: string, dto: ListMessagesDto) {
    const conversation = await this.getConversationForUser(conversationId, userId);
    const limit = dto.limit || 50;

    const query: Record<string, any> = { conversationId: conversation._id };
    if (dto.before) query.sentAt = { $lt: new Date(dto.before) };

    // Fetch newest first for paging, return oldest first for rendering.
    const messages = await this.messageModel.find(query).sort({ sentAt: -1, _id: -1 }).limit(limit + 1).lean();
    const hasMore = messages.length > limit;
    const page = messages.slice(0, limit).reverse();

    return {
      conversation: {
        ...conversation.toObject(),
        canReply:
          !!conversation.lastInboundAt &&
          Date.now() - conversation.lastInboundAt.getTime() < MESSENGER_REPLY_WINDOW_MS,
      },
      data: page,
      hasMore,
    };
  }

  async markAsRead(userId: string, conversationId: string): Promise<{ success: boolean }> {
    const conversation = await this.getConversationForUser(conversationId, userId);
    if (conversation.unreadCount > 0) {
      await this.conversationModel.updateOne({ _id: conversation._id }, { $set: { unreadCount: 0 } });
    }
    await this.notificationsService.markGroupAsRead(userId, `messenger:${conversation._id}`);
    return { success: true };
  }

  async getUnreadCount(userId: string, workspaceId: string): Promise<{ unreadCount: number; unreadConversations: number }> {
    await this.assertWorkspaceAccess(workspaceId, userId);
    const workspaceObjectId = toObjectId(workspaceId, 'workspace id');
    const activeAccountIds = await this.socialAccountModel
      .find({ workspaceId: workspaceObjectId, isDeleted: false })
      .distinct('_id');

    const [result] = await this.conversationModel.aggregate([
      { $match: { workspaceId: workspaceObjectId, socialAccountId: { $in: activeAccountIds }, unreadCount: { $gt: 0 } } },
      { $group: { _id: null, unreadCount: { $sum: '$unreadCount' }, unreadConversations: { $sum: 1 } } },
    ]);

    return { unreadCount: result?.unreadCount || 0, unreadConversations: result?.unreadConversations || 0 };
  }

  /**
   * Sends a Messenger reply from the Page to the conversation participant.
   */
  async sendReply(userId: string, conversationId: string, rawText: string) {
    const text = (rawText || '').trim();
    if (!text) throw new BadRequestException('Message cannot be empty.');

    const conversation = await this.getConversationForUser(conversationId, userId);
    const account = await this.socialAccountModel.findOne({ _id: conversation.socialAccountId, isDeleted: false });

    if (!account) {
      throw new BadRequestException('The Facebook Page for this conversation is no longer connected.');
    }
    if (account.platform !== SocialPlatform.FACEBOOK) {
      throw new BadRequestException('Replies are only supported for Facebook Messenger conversations.');
    }
    if (account.status === SocialAccountStatus.NEEDS_REAUTH || account.status === SocialAccountStatus.REVOKED) {
      throw new BadRequestException('Your Facebook Page needs to be reconnected before you can reply.');
    }
    if (!conversation.lastInboundAt || Date.now() - conversation.lastInboundAt.getTime() >= MESSENGER_REPLY_WINDOW_MS) {
      throw new BadRequestException(
        'Facebook only allows replies within 24 hours of the person\'s last message. You can reply once they message your Page again.',
      );
    }

    let response: { message_id: string; recipient_id: string };
    try {
      response = await this.facebookClient.sendMessengerText(
        account.platformAccountId,
        decryptToken(account.accessTokenEncrypted),
        conversation.participantId,
        text,
      );
    } catch (error: any) {
      if (error instanceof FacebookGraphError && error.requiresReauth) {
        await this.socialAccountsService.markNeedsReauth(account._id.toString(), error.message);
      }
      throw new BadRequestException(error.message || 'Failed to send the message.');
    }

    const sentAt = new Date();
    let message: MessageDocument | null;
    try {
      message = await this.messageModel.create({
        conversationId: conversation._id,
        workspaceId: conversation.workspaceId,
        socialAccountId: account._id,
        platform: account.platform,
        platformMessageId: response.message_id,
        direction: MessageDirection.OUTBOUND,
        senderId: account.platformAccountId,
        recipientId: conversation.participantId,
        text,
        attachments: [],
        status: MessageStatus.SENT,
        sentAt,
        sentByUserId: new Types.ObjectId(userId),
      });
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error;
      // The echo webhook was faster than us: attribute the stored echo to this user.
      message = await this.messageModel.findOneAndUpdate(
        { platformMessageId: response.message_id },
        { $set: { sentByUserId: new Types.ObjectId(userId) } },
        { new: true },
      );
    }

    await this.conversationModel.updateOne(
      { _id: conversation._id },
      {
        $set: {
          lastMessageText: previewText(text, []),
          lastMessageAt: sentAt,
          lastMessageDirection: MessageDirection.OUTBOUND,
          unreadCount: 0,
        },
      },
    );

    return message;
  }

  /**
   * Imports recent Messenger history from Facebook (threads that existed before connecting,
   * or messages missed while webhooks were not configured).
   */
  async syncFacebookConversations(userId: string, accountId: string) {
    const account = await this.socialAccountModel.findOne({
      _id: toObjectId(accountId, 'account id'),
      isDeleted: false,
    });
    if (!account) throw new NotFoundException('Social account not found.');
    await this.assertWorkspaceAccess(account.workspaceId, userId);
    if (account.platform !== SocialPlatform.FACEBOOK) {
      throw new BadRequestException('Only Facebook Pages support Messenger sync.');
    }

    const pageId = account.platformAccountId;
    let result;
    try {
      result = await this.facebookClient.getPageConversations(pageId, decryptToken(account.accessTokenEncrypted));
    } catch (error: any) {
      if (error instanceof FacebookGraphError && error.requiresReauth) {
        await this.socialAccountsService.markNeedsReauth(account._id.toString(), error.message);
      }
      if (error instanceof FacebookGraphError && error.isPermissionError) {
        throw new BadRequestException(
          'Facebook did not allow reading Page messages. Reconnect the Page and allow the "Manage and access Page conversations in Messenger" permission.',
        );
      }
      throw new BadRequestException(error.message || 'Failed to sync Messenger conversations.');
    }

    let conversationsSynced = 0;
    let messagesImported = 0;

    for (const thread of result.data || []) {
      const participant = thread.participants?.data?.find((p) => p.id !== pageId);
      if (!participant) continue;

      const conversation = await this.conversationModel.findOneAndUpdate(
        { socialAccountId: account._id, participantId: participant.id },
        {
          $setOnInsert: {
            workspaceId: account.workspaceId,
            socialAccountId: account._id,
            platform: account.platform,
            participantId: participant.id,
            unreadCount: 0,
          },
          $set: {
            platformConversationId: thread.id,
            ...(participant.name ? { participantName: participant.name } : {}),
          },
        },
        { upsert: true, new: true },
      );
      conversationsSynced++;

      let latest: { at: Date; text: string; direction: MessageDirection } | null = null;
      let latestInbound: Date | null = null;

      for (const m of thread.messages?.data || []) {
        const fromPage = m.from?.id === pageId;
        const sentAt = new Date(m.created_time);
        const attachments: MessageAttachment[] = (m.attachments?.data || []).map((a) => ({
          type: a.image_data ? 'image' : a.video_data ? 'video' : 'file',
          url: a.image_data?.url || a.video_data?.url || a.file_url,
          name: a.name,
        }));
        const direction = fromPage ? MessageDirection.OUTBOUND : MessageDirection.INBOUND;

        if (!latest || sentAt > latest.at) latest = { at: sentAt, text: previewText(m.message || '', attachments), direction };
        if (!fromPage && (!latestInbound || sentAt > latestInbound)) latestInbound = sentAt;

        try {
          await this.messageModel.create({
            conversationId: conversation._id,
            workspaceId: account.workspaceId,
            socialAccountId: account._id,
            platform: account.platform,
            platformMessageId: m.id,
            direction,
            senderId: m.from?.id || (fromPage ? pageId : participant.id),
            recipientId: fromPage ? participant.id : pageId,
            text: m.message || '',
            attachments,
            status: fromPage ? MessageStatus.SENT : MessageStatus.RECEIVED,
            sentAt,
          });
          messagesImported++;
        } catch (error) {
          if (!isDuplicateKeyError(error)) throw error;
        }
      }

      const set: Record<string, any> = {};
      if (latest && (!conversation.lastMessageAt || latest.at >= conversation.lastMessageAt)) {
        set.lastMessageText = latest.text;
        set.lastMessageAt = latest.at;
        set.lastMessageDirection = latest.direction;
      }
      if (latestInbound && (!conversation.lastInboundAt || latestInbound > conversation.lastInboundAt)) {
        set.lastInboundAt = latestInbound;
      }
      if (Object.keys(set).length > 0) {
        await this.conversationModel.updateOne({ _id: conversation._id }, { $set: set });
      }
    }

    this.logger.log(`Synced ${conversationsSynced} Messenger conversations (${messagesImported} new messages) for Page ${pageId}`);
    return { conversationsSynced, messagesImported };
  }
}
