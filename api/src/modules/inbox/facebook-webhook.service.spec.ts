import * as crypto from 'crypto';
import { Types } from 'mongoose';
import { FacebookWebhookService } from './facebook-webhook.service';
import { SocialPlatform } from '../social-accounts/schemas/social-account.schema';

describe('FacebookWebhookService', () => {
  const account: any = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    workspaceId: new Types.ObjectId(),
    platform: SocialPlatform.FACEBOOK,
    platformAccountId: 'PAGE_1',
    accountName: 'My Page',
  };

  let socialAccountModel: any;
  let postModel: any;
  let inboxService: any;
  let notificationsService: any;
  let config: any;
  let service: FacebookWebhookService;

  beforeEach(() => {
    socialAccountModel = { find: jest.fn().mockResolvedValue([account]) };
    postModel = {
      findOne: jest.fn().mockReturnValue({
        select: () => ({ lean: () => Promise.resolve({ _id: 'POST_DB_ID' }) }),
      }),
    };
    inboxService = { ingestMessengerEvent: jest.fn().mockResolvedValue({ stored: true, duplicate: false }) };
    notificationsService = {
      sendGroupedNotification: jest.fn().mockResolvedValue({}),
      sendNotification: jest.fn().mockResolvedValue({}),
    };
    config = { get: jest.fn().mockReturnValue('app-secret') };
    service = new FacebookWebhookService(socialAccountModel, postModel, inboxService, notificationsService, config);
  });

  describe('isValidSignature', () => {
    it('verifies Meta signatures with the app secret', () => {
      const body = Buffer.from('{"object":"page"}');
      const sig = `sha256=${crypto.createHmac('sha256', 'app-secret').update(body).digest('hex')}`;
      expect(service.isValidSignature(body, sig)).toBe(true);
      expect(service.isValidSignature(body, 'sha256=' + '0'.repeat(64))).toBe(false);
    });

    it('rejects everything when no app secret is configured', () => {
      config.get.mockReturnValue(undefined);
      const body = Buffer.from('{}');
      const sig = `sha256=${crypto.createHmac('sha256', '').update(body).digest('hex')}`;
      expect(service.isValidSignature(body, sig)).toBe(false);
    });
  });

  it('ignores payloads that are not Page events', async () => {
    const summary = await service.handlePayload({ object: 'instagram', entry: [] });
    expect(summary.entries).toBe(0);
    expect(socialAccountModel.find).not.toHaveBeenCalled();
  });

  it('routes Messenger events to the inbox for the connected Page', async () => {
    const event = { sender: { id: 'PSID' }, recipient: { id: 'PAGE_1' }, timestamp: 1, message: { mid: 'm1', text: 'hi' } };

    const summary = await service.handlePayload({ object: 'page', entry: [{ id: 'PAGE_1', time: 1, messaging: [event] }] });

    expect(socialAccountModel.find).toHaveBeenCalledWith({
      platform: SocialPlatform.FACEBOOK,
      platformAccountId: 'PAGE_1',
      isDeleted: false,
    });
    expect(inboxService.ingestMessengerEvent).toHaveBeenCalledWith(account, event);
    expect(summary).toMatchObject({ entries: 1, messagesStored: 1 });
  });

  it('skips Pages that are not connected and keeps processing other entries', async () => {
    socialAccountModel.find.mockResolvedValueOnce([]).mockResolvedValueOnce([account]);
    const event = { sender: { id: 'PSID' }, recipient: { id: 'PAGE_1' }, timestamp: 1, message: { mid: 'm2' } };

    const summary = await service.handlePayload({
      object: 'page',
      entry: [
        { id: 'UNKNOWN', time: 1, messaging: [event] },
        { id: 'PAGE_1', time: 1, messaging: [event] },
      ],
    });

    expect(summary).toMatchObject({ entries: 2, skipped: 1, messagesStored: 1 });
  });

  it('isolates failures of a single event', async () => {
    inboxService.ingestMessengerEvent.mockRejectedValueOnce(new Error('db down')).mockResolvedValueOnce({ stored: true });
    const ev = (mid: string) => ({ sender: { id: 'P' }, recipient: { id: 'PAGE_1' }, timestamp: 1, message: { mid } });

    const summary = await service.handlePayload({
      object: 'page',
      entry: [{ id: 'PAGE_1', time: 1, messaging: [ev('a'), ev('b')] }],
    });

    expect(summary.messagesStored).toBe(1);
  });

  describe('feed changes (push notifications)', () => {
    it('notifies about a new comment on a published post, linking to the post', async () => {
      const summary = await service.handlePayload({
        object: 'page',
        entry: [
          {
            id: 'PAGE_1',
            time: 1,
            changes: [
              {
                field: 'feed',
                value: { item: 'comment', verb: 'add', from: { id: 'U1', name: 'Alex' }, message: 'Love it!', post_id: 'PAGE_1_99' },
              },
            ],
          },
        ],
      });

      expect(summary.feedNotifications).toBe(1);
      expect(notificationsService.sendGroupedNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'engagement',
          message: 'Alex on My Page: Love it!',
          link: '/user/posts/view/POST_DB_ID',
          groupKey: `fb-comments:${account._id}:PAGE_1_99`,
        }),
      );
    });

    it('does not notify about the Page\'s own activity or reactions', async () => {
      await service.handleFeedChange(account, { item: 'comment', verb: 'add', from: { id: 'PAGE_1' }, post_id: 'x' });
      await service.handleFeedChange(account, { item: 'reaction', verb: 'add', from: { id: 'U1' }, post_id: 'x' });
      await service.handleFeedChange(account, { item: 'comment', verb: 'remove', from: { id: 'U1' }, post_id: 'x' });

      expect(notificationsService.sendGroupedNotification).not.toHaveBeenCalled();
      expect(notificationsService.sendNotification).not.toHaveBeenCalled();
    });

    it('notifies about visitor posts on the Page', async () => {
      const notified = await service.handleFeedChange(account, {
        item: 'status',
        verb: 'add',
        from: { id: 'U2', name: 'Sam' },
        message: 'Great service',
      });
      expect(notified).toBe(true);
      expect(notificationsService.sendNotification).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Sam posted on your Facebook Page', category: 'engagement' }),
      );
    });
  });
});
