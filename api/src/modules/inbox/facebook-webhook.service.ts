import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SocialAccount,
  SocialAccountDocument,
  SocialPlatform,
} from '../social-accounts/schemas/social-account.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { InboxService } from './inbox.service';
import { verifyMetaSignature } from './utils/meta-signature.util';
import {
  FeedChangeValue,
  PageWebhookEntry,
  PageWebhookPayload,
  WebhookProcessingSummary,
} from './facebook-webhook.types';

@Injectable()
export class FacebookWebhookService {
  private readonly logger = new Logger(FacebookWebhookService.name);

  constructor(
    @InjectModel(SocialAccount.name) private readonly socialAccountModel: Model<SocialAccountDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly inboxService: InboxService,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validates that a webhook POST really comes from Meta for our app.
   */
  isValidSignature(rawBody: Buffer | undefined, signatureHeader: string | undefined): boolean {
    const appSecret = this.configService.get<string>('social.meta.appSecret');
    if (!appSecret) {
      this.logger.error('META_APP_SECRET is not configured: rejecting Facebook webhook (cannot verify signature).');
      return false;
    }
    return verifyMetaSignature(rawBody, signatureHeader, appSecret);
  }

  /**
   * Processes a verified Page webhook payload. Each entry/event is isolated so one bad
   * event never prevents the rest of the batch from being stored.
   */
  async handlePayload(payload: PageWebhookPayload): Promise<WebhookProcessingSummary> {
    const summary: WebhookProcessingSummary = {
      entries: 0,
      messagesStored: 0,
      duplicates: 0,
      feedNotifications: 0,
      skipped: 0,
    };

    if (!payload || payload.object !== 'page' || !Array.isArray(payload.entry)) {
      this.logger.debug(`Ignoring webhook payload for object '${payload?.object}'.`);
      return summary;
    }

    for (const entry of payload.entry) {
      summary.entries++;
      try {
        await this.handleEntry(entry, summary);
      } catch (error: any) {
        this.logger.error(`Failed to process webhook entry for Page ${entry?.id}: ${error.message}`, error.stack);
      }
    }

    return summary;
  }

  private async handleEntry(entry: PageWebhookEntry, summary: WebhookProcessingSummary): Promise<void> {
    // The same Page can be connected in several workspaces; every one of them should get the event.
    const accounts = await this.socialAccountModel.find({
      platform: SocialPlatform.FACEBOOK,
      platformAccountId: entry.id,
      isDeleted: false,
    });

    if (accounts.length === 0) {
      this.logger.warn(`Received webhook for Page ${entry.id}, but it is not connected to any workspace.`);
      summary.skipped++;
      return;
    }

    for (const event of entry.messaging || []) {
      for (const account of accounts) {
        try {
          const result = await this.inboxService.ingestMessengerEvent(account, event);
          if (result.stored) summary.messagesStored++;
          else if (result.duplicate) summary.duplicates++;
          else summary.skipped++;
        } catch (error: any) {
          this.logger.error(`Failed to store Messenger event for Page ${entry.id}: ${error.message}`);
        }
      }
    }

    for (const change of entry.changes || []) {
      if (change.field !== 'feed' || !change.value) {
        summary.skipped++;
        continue;
      }
      for (const account of accounts) {
        try {
          if (await this.handleFeedChange(account, change.value)) summary.feedNotifications++;
          else summary.skipped++;
        } catch (error: any) {
          this.logger.error(`Failed to handle feed change for Page ${entry.id}: ${error.message}`);
        }
      }
    }
  }

  /**
   * Turns Page feed activity from other people (new comments, visitor posts) into in-app notifications.
   * Returns true when a notification was created/updated.
   */
  async handleFeedChange(account: SocialAccountDocument, value: FeedChangeValue): Promise<boolean> {
    // Ignore the Page's own activity (e.g. our own published posts or replies).
    if (!value.from?.id || value.from.id === account.platformAccountId) return false;
    if (value.verb !== 'add') return false;

    const who = value.from.name || 'Someone';
    const snippet = (value.message || '').trim().slice(0, 140);

    if (value.item === 'comment' && value.post_id) {
      const post = await this.postModel
        .findOne({ 'targets.externalPostId': value.post_id, workspaceId: account.workspaceId, isDeleted: false })
        .select('_id')
        .lean();

      await this.notificationsService.sendGroupedNotification({
        userId: account.userId.toString(),
        workspaceId: account.workspaceId.toString(),
        title: `New comment on your Facebook post`,
        message: `${who} on ${account.accountName}: ${snippet || 'left a comment'}`,
        type: 'info',
        category: 'engagement',
        link: post ? `/user/posts/view/${post._id}` : '/user/posts',
        groupKey: `fb-comments:${account._id}:${value.post_id}`,
      });
      return true;
    }

    if (value.item === 'post' || value.item === 'status' || value.item === 'photo' || value.item === 'video') {
      await this.notificationsService.sendNotification({
        userId: account.userId.toString(),
        workspaceId: account.workspaceId.toString(),
        title: `${who} posted on your Facebook Page`,
        message: `${account.accountName}: ${snippet || 'New visitor post'}`,
        type: 'info',
        category: 'engagement',
      });
      return true;
    }

    // Reactions, shares, edits, etc. are intentionally not notified to avoid noise.
    return false;
  }
}
