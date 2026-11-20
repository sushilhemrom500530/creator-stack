import { FacebookProvider, isFacebookVideoUrl } from './facebook.provider';
import { FacebookGraphError } from './facebook.errors';
import { SocialPlatform } from '../../../modules/social-accounts/schemas/social-account.schema';
import { SocialAccountContext } from '../social-provider.types';

describe('FacebookProvider', () => {
  let oauth: Record<string, jest.Mock>;
  let client: Record<string, jest.Mock>;
  let provider: FacebookProvider;

  const account: SocialAccountContext = {
    accountId: 'acc1',
    workspaceId: 'ws1',
    userId: 'u1',
    platform: SocialPlatform.FACEBOOK,
    platformAccountId: 'PAGE_1',
    accessToken: 'PAGE_TOKEN',
  };

  const page = (id: string, tasks?: string[]) => ({
    id,
    name: `Page ${id}`,
    category: 'Brand',
    access_token: `token-${id}`,
    tasks,
  });

  beforeEach(() => {
    oauth = {
      getAuthorizationUrl: jest.fn(),
      exchangeCodeForShortLivedToken: jest.fn().mockResolvedValue({ access_token: 'short' }),
      exchangeForLongLivedUserToken: jest.fn().mockResolvedValue({ access_token: 'long', expires_in: 5184000 }),
      fetchGrantedPermissions: jest
        .fn()
        .mockResolvedValue([
          'public_profile',
          'pages_show_list',
          'pages_read_engagement',
          'pages_manage_posts',
          'pages_manage_metadata',
          'pages_messaging',
        ]),
      fetchManagedPages: jest.fn().mockResolvedValue([page('PAGE_1', ['CREATE_CONTENT', 'MODERATE'])]),
    };
    client = {
      getPageDetails: jest.fn(),
      publishFeed: jest.fn().mockResolvedValue({ id: 'PAGE_1_POST' }),
      publishPhoto: jest.fn(),
      publishVideo: jest.fn(),
      getPermalink: jest.fn().mockResolvedValue('https://www.facebook.com/PAGE_1/posts/1'),
      subscribePageToWebhooks: jest.fn().mockResolvedValue(true),
      unsubscribePageFromWebhooks: jest.fn().mockResolvedValue(true),
      deletePost: jest.fn(),
      getPageInsights: jest.fn(),
    };
    provider = new FacebookProvider(oauth as any, client as any);
  });

  describe('exchangeCode (connect Facebook)', () => {
    it('returns a non-expiring Page token, the user token for refresh, and granted scopes', async () => {
      const result = await provider.exchangeCode('code');

      expect(result.accessToken).toBe('token-PAGE_1');
      expect(result.refreshToken).toBe('long');
      expect(result.tokenExpiresAt).toBeNull();
      expect(result.scopes).toContain('pages_manage_posts');
      expect(result.metadata).toMatchObject({ pageId: 'PAGE_1', missingMessagingPermissions: [] });
    });

    it('refuses to connect when the user declined the publishing permission', async () => {
      oauth.fetchGrantedPermissions.mockResolvedValue(['public_profile', 'pages_show_list', 'pages_read_engagement']);

      await expect(provider.exchangeCode('code')).rejects.toThrow(/pages_manage_posts/);
      expect(oauth.fetchManagedPages).not.toHaveBeenCalled();
    });

    it('still connects but records missing messaging permissions', async () => {
      oauth.fetchGrantedPermissions.mockResolvedValue(['pages_show_list', 'pages_read_engagement', 'pages_manage_posts']);

      const result = await provider.exchangeCode('code');
      expect(result.metadata?.missingMessagingPermissions).toEqual(['pages_messaging', 'pages_manage_metadata']);
    });

    it('prefers a Page where the user can create content', async () => {
      oauth.fetchManagedPages.mockResolvedValue([page('ANALYST_ONLY', ['ANALYZE']), page('EDITOR', ['CREATE_CONTENT'])]);
      const result = await provider.exchangeCode('code');
      expect(result.metadata?.pageId).toBe('EDITOR');
    });

    it('explains clearly when no Page was shared', async () => {
      oauth.fetchManagedPages.mockResolvedValue([]);
      await expect(provider.exchangeCode('code')).rejects.toThrow(/No Facebook Pages/);
    });
  });

  describe('refreshToken', () => {
    it('re-derives the token of the same connected Page, not the first Page', async () => {
      oauth.fetchManagedPages.mockResolvedValue([page('OTHER'), page('PAGE_1')]);
      const result = await provider.refreshToken('long', { platformAccountId: 'PAGE_1' });
      expect(result.accessToken).toBe('token-PAGE_1');
      expect(result.tokenExpiresAt).toBeNull();
    });

    it('fails when the connected Page is no longer accessible', async () => {
      oauth.fetchManagedPages.mockResolvedValue([page('OTHER')]);
      await expect(provider.refreshToken('long', { platformAccountId: 'PAGE_1' })).rejects.toThrow(/no longer accessible/);
    });
  });

  describe('webhook hooks', () => {
    it('records a successful webhook subscription', async () => {
      const res = await provider.onAccountConnected(account);
      expect(client.subscribePageToWebhooks).toHaveBeenCalledWith('PAGE_1', 'PAGE_TOKEN');
      expect(res.metadata).toMatchObject({ webhooksSubscribed: true, webhookError: null });
    });

    it('never throws when subscription fails and records the reason', async () => {
      client.subscribePageToWebhooks.mockRejectedValue(new Error('(#200) Permissions error'));
      const res = await provider.onAccountConnected(account);
      expect(res.metadata).toMatchObject({ webhooksSubscribed: false, webhookError: '(#200) Permissions error' });
    });
  });

  describe('publishPost', () => {
    it('publishes a text + link post to the Page feed and returns the permalink', async () => {
      const res = await provider.publishPost(account, { content: 'Hello', linkUrl: 'https://x.io' });

      expect(client.publishFeed).toHaveBeenCalledWith('PAGE_1', 'PAGE_TOKEN', 'Hello', 'https://x.io', undefined);
      expect(res).toMatchObject({
        success: true,
        platformPostId: 'PAGE_1_POST',
        platformPostUrl: 'https://www.facebook.com/PAGE_1/posts/1',
      });
    });

    it('publishes a single photo with the text as caption', async () => {
      client.publishPhoto.mockResolvedValue({ id: 'photo1', post_id: 'PAGE_1_77' });
      const res = await provider.publishPost(account, { content: 'Look', mediaUrls: ['https://cdn/a.jpg'] });

      expect(client.publishPhoto).toHaveBeenCalledWith('PAGE_1', 'PAGE_TOKEN', 'https://cdn/a.jpg', 'Look');
      expect(res.platformPostId).toBe('PAGE_1_77');
    });

    it('publishes multiple photos as one post with attached_media', async () => {
      client.publishPhoto.mockResolvedValueOnce({ id: 'p1' }).mockResolvedValueOnce({ id: 'p2' });
      client.publishFeed.mockResolvedValue({ id: 'PAGE_1_ALBUM' });

      const res = await provider.publishPost(account, {
        content: 'Album',
        mediaUrls: ['https://cdn/a.jpg', 'https://cdn/b.png'],
      });

      expect(client.publishPhoto).toHaveBeenNthCalledWith(1, 'PAGE_1', 'PAGE_TOKEN', 'https://cdn/a.jpg', undefined, false);
      expect(client.publishFeed).toHaveBeenCalledWith('PAGE_1', 'PAGE_TOKEN', 'Album', undefined, undefined, ['p1', 'p2']);
      expect(res).toMatchObject({ success: true, platformPostId: 'PAGE_1_ALBUM' });
    });

    it('auto-detects videos from the media URL', async () => {
      client.publishVideo.mockResolvedValue({ id: 'vid1' });
      client.getPermalink.mockResolvedValue(undefined);

      const res = await provider.publishPost(account, {
        content: 'Clip',
        mediaUrls: ['https://res.cloudinary.com/demo/video/upload/v1/clip'],
      });

      expect(client.publishVideo).toHaveBeenCalled();
      expect(res.platformPostUrl).toBe('https://www.facebook.com/PAGE_1/videos/vid1');
    });

    it('marks token errors as requiring re-authentication instead of throwing', async () => {
      client.publishFeed.mockRejectedValue(new FacebookGraphError({ code: 190, message: 'expired' }, 'x'));

      const res = await provider.publishPost(account, { content: 'Hello' });

      expect(res.success).toBe(false);
      expect(res.requiresReauth).toBe(true);
      expect(res.errorCode).toBe('190');
    });

    it('rejects an empty post without calling Facebook', async () => {
      const res = await provider.publishPost(account, { content: '   ' });
      expect(res.success).toBe(false);
      expect(client.publishFeed).not.toHaveBeenCalled();
    });
  });

  it('recognises common video URLs', () => {
    expect(isFacebookVideoUrl('https://cdn.x/clip.MP4?sig=1')).toBe(true);
    expect(isFacebookVideoUrl('https://cdn.x/photo.jpg')).toBe(false);
  });
});
