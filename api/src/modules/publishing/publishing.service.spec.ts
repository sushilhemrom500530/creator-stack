import { Types } from 'mongoose';
import { PublishingService } from './publishing.service';
import { PostStatus, PostTargetStatus } from '../posts/schemas/post.schema';
import { SocialAccountStatus, SocialPlatform } from '../social-accounts/schemas/social-account.schema';

describe('PublishingService (Facebook publishing)', () => {
  const postId = new Types.ObjectId();
  const accountId = new Types.ObjectId();

  let post: any;
  let postModel: any;
  let socialAccountsService: any;
  let providerFactory: any;
  let notificationsService: any;
  let provider: any;
  let service: PublishingService;

  const makePost = (targetStatus = PostTargetStatus.PENDING, accountStatus = SocialAccountStatus.ACTIVE) => ({
    _id: postId,
    userId: new Types.ObjectId(),
    workspaceId: new Types.ObjectId(),
    baseContent: 'Hello from Creator Stack',
    mediaUrls: [],
    status: PostStatus.DRAFT,
    targets: [
      {
        accountId: {
          _id: accountId,
          platform: SocialPlatform.FACEBOOK,
          platformAccountId: 'PAGE_1',
          accountName: 'My Page',
          status: accountStatus,
          metadata: {},
        },
        platform: SocialPlatform.FACEBOOK,
        status: targetStatus,
        options: {},
        retryCount: 0,
      },
    ],
    save: jest.fn().mockImplementation(function (this: any) {
      return Promise.resolve(this);
    }),
  });

  const mockFind = (doc: any) => {
    postModel.findOne.mockReturnValue({ populate: jest.fn().mockResolvedValue(doc) });
  };

  beforeEach(() => {
    post = makePost();
    postModel = { findOne: jest.fn() };
    mockFind(post);
    provider = {
      publishPost: jest.fn().mockResolvedValue({
        success: true,
        platformPostId: 'PAGE_1_99',
        platformPostUrl: 'https://www.facebook.com/PAGE_1/posts/99',
      }),
    };
    providerFactory = { hasProvider: jest.fn().mockReturnValue(true), getProvider: jest.fn().mockReturnValue(provider) };
    socialAccountsService = {
      getDecryptedTokens: jest.fn().mockResolvedValue({ accessToken: 'PAGE_TOKEN', refreshToken: 'USER_TOKEN' }),
      findOne: jest.fn(),
      markNeedsReauth: jest.fn().mockResolvedValue(null),
    };
    notificationsService = { sendNotification: jest.fn().mockResolvedValue({}) };
    service = new PublishingService(postModel, socialAccountsService, providerFactory, notificationsService);
  });

  it('publishes the post content to the connected Facebook Page and marks it published', async () => {
    const saved = await service.publishPost(postId);

    expect(provider.publishPost).toHaveBeenCalledWith(
      expect.objectContaining({ platformAccountId: 'PAGE_1', accessToken: 'PAGE_TOKEN' }),
      expect.objectContaining({ content: 'Hello from Creator Stack' }),
    );
    expect(saved.status).toBe(PostStatus.PUBLISHED);
    expect(saved.targets[0]).toMatchObject({
      status: PostTargetStatus.PUBLISHED,
      externalPostId: 'PAGE_1_99',
      externalPostUrl: 'https://www.facebook.com/PAGE_1/posts/99',
    });
    expect(notificationsService.sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success', category: 'publishing', link: `/user/posts/view/${postId}` }),
    );
  });

  it('never re-sends a target that is already published (no duplicate Facebook posts)', async () => {
    post = makePost(PostTargetStatus.PUBLISHED);
    post.status = PostStatus.PARTIALLY_PUBLISHED;
    mockFind(post);

    await service.publishPost(postId);

    expect(provider.publishPost).not.toHaveBeenCalled();
  });

  it('flags the account for reconnection when Facebook rejects the token', async () => {
    provider.publishPost.mockResolvedValue({
      success: false,
      errorMessage: 'Your Facebook connection has expired or was revoked.',
      requiresReauth: true,
    });

    const saved = await service.publishPost(postId);

    expect(saved.status).toBe(PostStatus.FAILED);
    expect(socialAccountsService.markNeedsReauth).toHaveBeenCalledWith(accountId.toString(), expect.any(String));
    expect(notificationsService.sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'token_expiry', link: '/user/connected-accounts' }),
    );
  });

  it('fails fast with a clear message when the account needs to be reconnected', async () => {
    post = makePost(PostTargetStatus.PENDING, SocialAccountStatus.NEEDS_REAUTH);
    mockFind(post);

    const saved = await service.publishPost(postId);

    expect(provider.publishPost).not.toHaveBeenCalled();
    expect(saved.targets[0].status).toBe(PostTargetStatus.FAILED);
    expect(saved.targets[0].errorMessage).toMatch(/needs to be reconnected/);
  });

  it('rejects a second concurrent publish of the same post', async () => {
    let release: () => void = () => undefined;
    provider.publishPost.mockReturnValue(
      new Promise((resolve) => {
        release = () => resolve({ success: true, platformPostId: 'x' });
      }),
    );

    const first = service.publishPost(postId);
    await expect(service.publishPost(postId)).rejects.toThrow(/already being published/);
    // let the first publish reach the provider, then complete it
    await new Promise((r) => setImmediate(r));
    release();
    await first;
  });

  it('retryTarget refuses to republish an already-published target', async () => {
    post = makePost(PostTargetStatus.PUBLISHED);
    mockFind(post);

    await expect(service.retryTarget(postId.toString(), accountId.toString(), 'user')).rejects.toThrow(
      /already been published/,
    );
    expect(provider.publishPost).not.toHaveBeenCalled();
  });
});
