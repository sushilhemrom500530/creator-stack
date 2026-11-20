import { Types } from 'mongoose';
import { InboxService, MESSENGER_REPLY_WINDOW_MS, previewText } from './inbox.service';
import { MessageDirection } from './schemas/conversation.schema';
import { SocialAccountStatus, SocialPlatform } from '../social-accounts/schemas/social-account.schema';
import { encryptToken } from '../../common/utils';
import { FacebookGraphError } from '../../providers/social/facebook/facebook.errors';

describe('InboxService (Facebook Messenger)', () => {
  const userId = new Types.ObjectId().toString();
  const workspaceId = new Types.ObjectId();
  const accountId = new Types.ObjectId();
  const conversationId = new Types.ObjectId();

  let conversationModel: any;
  let messageModel: any;
  let workspaceModel: any;
  let socialAccountModel: any;
  let socialAccountsService: any;
  let notificationsService: any;
  let facebookClient: any;
  let service: InboxService;
  let conversation: any;

  const account: any = {
    _id: accountId,
    userId: new Types.ObjectId(),
    workspaceId,
    platform: SocialPlatform.FACEBOOK,
    platformAccountId: 'PAGE_1',
    accountName: 'My Page',
    status: SocialAccountStatus.ACTIVE,
    accessTokenEncrypted: encryptToken('PAGE_TOKEN'),
  };

  const inboundEvent = (mid = 'm_in_1', text = 'Hi, is this available?') => ({
    sender: { id: 'PSID_1' },
    recipient: { id: 'PAGE_1' },
    timestamp: Date.now(),
    message: { mid, text },
  });

  beforeEach(() => {
    conversation = {
      _id: conversationId,
      workspaceId,
      socialAccountId: accountId,
      participantId: 'PSID_1',
      participantName: null,
      lastMessageAt: null,
      lastInboundAt: null,
      unreadCount: 0,
    };
    conversationModel = {
      findOneAndUpdate: jest.fn().mockResolvedValue(conversation),
      findById: jest.fn().mockResolvedValue(conversation),
      updateOne: jest.fn().mockResolvedValue({}),
    };
    messageModel = {
      exists: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(async (doc) => ({ _id: new Types.ObjectId(), ...doc })),
      findOneAndUpdate: jest.fn(),
    };
    workspaceModel = { exists: jest.fn().mockResolvedValue({ _id: workspaceId }) };
    socialAccountModel = { findOne: jest.fn().mockResolvedValue(account) };
    socialAccountsService = { markNeedsReauth: jest.fn() };
    notificationsService = {
      sendGroupedNotification: jest.fn().mockResolvedValue({}),
      markGroupAsRead: jest.fn().mockResolvedValue({ updatedCount: 1 }),
    };
    facebookClient = {
      getMessengerUserProfile: jest.fn().mockResolvedValue({ id: 'PSID_1', first_name: 'Jane', last_name: 'Doe', profile_pic: 'https://pic' }),
      sendMessengerText: jest.fn().mockResolvedValue({ recipient_id: 'PSID_1', message_id: 'm_out_1' }),
    };
    service = new InboxService(
      conversationModel,
      messageModel,
      workspaceModel,
      socialAccountModel,
      socialAccountsService,
      notificationsService,
      facebookClient,
    );
  });

  describe('ingestMessengerEvent (user sends a message from Facebook)', () => {
    it('stores the message, bumps unread, enriches the sender and notifies the user', async () => {
      const result = await service.ingestMessengerEvent(account, inboundEvent() as any);

      expect(result).toEqual({ stored: true, duplicate: false, conversationId: conversationId.toString() });
      expect(messageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          platformMessageId: 'm_in_1',
          direction: MessageDirection.INBOUND,
          text: 'Hi, is this available?',
        }),
      );
      expect(conversationModel.updateOne).toHaveBeenCalledWith(
        { _id: conversationId },
        expect.objectContaining({
          $inc: { unreadCount: 1 },
          $set: expect.objectContaining({ lastMessageText: 'Hi, is this available?', lastInboundAt: expect.any(Date) }),
        }),
      );
      expect(facebookClient.getMessengerUserProfile).toHaveBeenCalledWith('PSID_1', 'PAGE_TOKEN');
      expect(notificationsService.sendGroupedNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Messenger message from Jane Doe',
          category: 'inbox',
          link: `/user/inbox?conversation=${conversationId}`,
          groupKey: `messenger:${conversationId}`,
        }),
      );
    });

    it('ignores webhook retries of the same message (dedupe by mid)', async () => {
      messageModel.exists.mockResolvedValue({ _id: 'existing' });

      const result = await service.ingestMessengerEvent(account, inboundEvent() as any);

      expect(result).toEqual({ stored: false, duplicate: true });
      expect(messageModel.create).not.toHaveBeenCalled();
      expect(notificationsService.sendGroupedNotification).not.toHaveBeenCalled();
    });

    it('treats a race on the unique mid index as a duplicate', async () => {
      messageModel.create.mockRejectedValue({ code: 11000 });
      const result = await service.ingestMessengerEvent(account, inboundEvent() as any);
      expect(result.duplicate).toBe(true);
      expect(notificationsService.sendGroupedNotification).not.toHaveBeenCalled();
    });

    it('stores Page echoes as outbound messages in the participant thread without notifying', async () => {
      const echo = {
        sender: { id: 'PAGE_1' },
        recipient: { id: 'PSID_1' },
        timestamp: Date.now(),
        message: { mid: 'm_echo', text: 'Replied from Business Suite', is_echo: true },
      };

      await service.ingestMessengerEvent(account, echo as any);

      expect(conversationModel.findOneAndUpdate).toHaveBeenCalledWith(
        { socialAccountId: accountId, participantId: 'PSID_1' },
        expect.anything(),
        expect.anything(),
      );
      expect(messageModel.create).toHaveBeenCalledWith(expect.objectContaining({ direction: MessageDirection.OUTBOUND }));
      expect(notificationsService.sendGroupedNotification).not.toHaveBeenCalled();
    });

    it('ignores read/delivery receipts', async () => {
      const result = await service.ingestMessengerEvent(account, {
        sender: { id: 'PSID_1' },
        recipient: { id: 'PAGE_1' },
        timestamp: Date.now(),
        read: { watermark: Date.now() },
      } as any);
      expect(result.stored).toBe(false);
      expect(conversationModel.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('shows a friendly preview for attachment-only messages', () => {
      expect(previewText('', [{ type: 'image', url: 'x' }])).toBe('📷 Sent a photo');
      expect(previewText('  hello  ', [])).toBe('hello');
    });
  });

  describe('sendReply (reply from the dashboard)', () => {
    it('sends the reply through Messenger and stores it as outbound', async () => {
      conversation.lastInboundAt = new Date(Date.now() - 60_000);

      const message = await service.sendReply(userId, conversationId.toString(), '  Yes, it is!  ');

      expect(facebookClient.sendMessengerText).toHaveBeenCalledWith('PAGE_1', 'PAGE_TOKEN', 'PSID_1', 'Yes, it is!');
      expect(message).toMatchObject({ platformMessageId: 'm_out_1', direction: MessageDirection.OUTBOUND, text: 'Yes, it is!' });
      expect(conversationModel.updateOne).toHaveBeenCalledWith(
        { _id: conversationId },
        { $set: expect.objectContaining({ lastMessageDirection: MessageDirection.OUTBOUND, unreadCount: 0 }) },
      );
    });

    it('blocks replies outside the 24-hour Messenger window before calling Facebook', async () => {
      conversation.lastInboundAt = new Date(Date.now() - MESSENGER_REPLY_WINDOW_MS - 1000);

      await expect(service.sendReply(userId, conversationId.toString(), 'Hello?')).rejects.toThrow(/24 hours/);
      expect(facebookClient.sendMessengerText).not.toHaveBeenCalled();
    });

    it('rejects users outside the workspace', async () => {
      workspaceModel.exists.mockResolvedValue(null);
      await expect(service.sendReply(userId, conversationId.toString(), 'Hi')).rejects.toThrow(/access denied/);
    });

    it('marks the Page for reconnection when Facebook rejects the token', async () => {
      conversation.lastInboundAt = new Date();
      facebookClient.sendMessengerText.mockRejectedValue(new FacebookGraphError({ code: 190, message: 'expired' }, 'x'));

      await expect(service.sendReply(userId, conversationId.toString(), 'Hi')).rejects.toThrow(/reconnect/);
      expect(socialAccountsService.markNeedsReauth).toHaveBeenCalledWith(accountId.toString(), expect.any(String));
    });

    it('attributes the stored echo to the sender when the echo webhook arrived first', async () => {
      conversation.lastInboundAt = new Date();
      messageModel.create.mockRejectedValue({ code: 11000 });
      messageModel.findOneAndUpdate.mockResolvedValue({ platformMessageId: 'm_out_1' });

      const message = await service.sendReply(userId, conversationId.toString(), 'Hi');

      expect(messageModel.findOneAndUpdate).toHaveBeenCalledWith(
        { platformMessageId: 'm_out_1' },
        { $set: { sentByUserId: expect.any(Types.ObjectId) } },
        { new: true },
      );
      expect(message).toEqual({ platformMessageId: 'm_out_1' });
    });
  });

  it('markAsRead clears unread count and the grouped notification', async () => {
    conversation.unreadCount = 3;
    await service.markAsRead(userId, conversationId.toString());
    expect(conversationModel.updateOne).toHaveBeenCalledWith({ _id: conversationId }, { $set: { unreadCount: 0 } });
    expect(notificationsService.markGroupAsRead).toHaveBeenCalledWith(userId, `messenger:${conversationId}`);
  });
});
