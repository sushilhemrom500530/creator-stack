import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument, PostStatus, PostTargetStatus } from '../posts/schemas/post.schema';
import { SocialAccountsService } from '../social-accounts/social-accounts.service';
import { SocialAccountStatus } from '../social-accounts/schemas/social-account.schema';
import { SocialProviderFactory } from '../../providers/social/social-provider.factory';
import { SocialAccountContext, PublishPostInput } from '../../providers/social/social-provider.types';
import { NotificationsService } from '../notifications/notifications.service';

/** Account states in which publishing cannot succeed until the user reconnects. */
const BLOCKED_ACCOUNT_STATUSES = new Set<string>([SocialAccountStatus.NEEDS_REAUTH, SocialAccountStatus.REVOKED]);

@Injectable()
export class PublishingService {
  private readonly logger = new Logger(PublishingService.name);

  /** Posts currently being dispatched by this instance: prevents double-posting on concurrent triggers. */
  private readonly inFlight = new Set<string>();

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly socialAccountsService: SocialAccountsService,
    private readonly socialProviderFactory: SocialProviderFactory,
    private readonly notificationsService: NotificationsService,
  ) { }

  /**
   * Core multi-platform publishing engine.
   * Dispatches post across all targeted social networks in parallel with isolated error handling.
   * Targets that are already published are never re-sent (avoids duplicate posts on retries).
   */
  async publishPost(postId: string | Types.ObjectId): Promise<PostDocument> {
    const key = postId.toString();
    if (this.inFlight.has(key)) {
      throw new ConflictException('This post is already being published. Please wait a moment.');
    }
    this.inFlight.add(key);

    try {
      return await this.dispatchPost(key);
    } finally {
      this.inFlight.delete(key);
    }
  }

  private async dispatchPost(postId: string): Promise<PostDocument> {
    const post = await this.postModel
      .findOne({ _id: new Types.ObjectId(postId), isDeleted: false })
      .populate('targets.accountId');

    if (!post) {
      throw new NotFoundException(`Post [${postId}] not found for publishing.`);
    }

    if (post.status === PostStatus.PUBLISHED) {
      throw new BadRequestException(`Post [${postId}] has already been published.`);
    }

    const pendingTargets = post.targets.filter((t) => t.status !== PostTargetStatus.PUBLISHED);

    post.status = PostStatus.PUBLISHING;
    await post.save();

    this.logger.log(`Starting multi-platform publishing for post [${postId}] across ${pendingTargets.length} targets.`);

    // Execute publishing across all platforms in parallel
    await Promise.allSettled(pendingTargets.map((target) => this.publishToTarget(post, target)));

    this.applyAggregateStatus(post);

    const saved = await post.save();
    this.logger.log(`Completed publishing for post [${postId}]. Final status: [${saved.status}]`);

    await this.notifyOutcome(saved);

    return saved;
  }

  private applyAggregateStatus(post: PostDocument): void {
    const allPublished = post.targets.every((t) => t.status === PostTargetStatus.PUBLISHED);
    const anyPublished = post.targets.some((t) => t.status === PostTargetStatus.PUBLISHED);
    const anyFailed = post.targets.some((t) => t.status === PostTargetStatus.FAILED);

    if (allPublished) {
      post.status = PostStatus.PUBLISHED;
      post.publishedAt = new Date();
    } else if (anyFailed && anyPublished) {
      post.status = PostStatus.PARTIALLY_PUBLISHED;
    } else if (anyFailed) {
      post.status = PostStatus.FAILED;
    }
  }

  private async notifyOutcome(post: PostDocument): Promise<void> {
    const link = `/user/posts/view/${post._id}`;
    try {
      if (post.status === PostStatus.PUBLISHED) {
        const platforms = Array.from(new Set(post.targets.map((t) => t.platform))).join(', ');
        await this.notificationsService.sendNotification({
          userId: post.userId.toString(),
          workspaceId: post.workspaceId.toString(),
          title: 'Post Published Successfully 🚀',
          message: `Your post was published to ${platforms}.`,
          type: 'success',
          category: 'publishing',
          link,
        });
      } else if (post.status === PostStatus.PARTIALLY_PUBLISHED || post.status === PostStatus.FAILED) {
        const failed = post.targets.filter((t) => t.status === PostTargetStatus.FAILED);
        const detail = failed.map((t) => `${t.platform}: ${t.errorMessage || 'unknown error'}`).join(' | ');
        await this.notificationsService.sendNotification({
          userId: post.userId.toString(),
          workspaceId: post.workspaceId.toString(),
          title: 'Post Publishing Issues ⚠️',
          message: `Publishing failed for ${failed.length} platform(s). ${detail}`.slice(0, 1000),
          type: 'warning',
          category: 'publishing',
          link,
        });
      }
    } catch (err: any) {
      this.logger.warn(`Failed to dispatch notification: ${err.message}`);
    }
  }

  /**
   * Publishes post to a single isolated social account target.
   */
  private async publishToTarget(post: PostDocument, target: any): Promise<void> {
    target.status = PostTargetStatus.PROCESSING;

    try {
      const accountId = target.accountId._id ? target.accountId._id.toString() : target.accountId.toString();
      const platform = target.platform;

      if (!this.socialProviderFactory.hasProvider(platform)) {
        throw new Error(`Social provider for '${platform}' is not configured.`);
      }

      // 1. Retrieve decrypted tokens
      const { accessToken, refreshToken } = await this.socialAccountsService.getDecryptedTokens(accountId);
      const accountDoc = target.accountId.platformAccountId ? target.accountId : await this.socialAccountsService.findOne(accountId, post.userId.toString());

      if (BLOCKED_ACCOUNT_STATUSES.has(accountDoc.status)) {
        throw new Error(
          `Your ${platform} account "${accountDoc.accountName}" needs to be reconnected before posting. Go to Connected Accounts and reconnect it.`,
        );
      }

      // 2. Build account execution context
      const context: SocialAccountContext = {
        accountId,
        workspaceId: post.workspaceId.toString(),
        userId: post.userId.toString(),
        platform,
        platformAccountId: accountDoc.platformAccountId,
        accessToken,
        refreshToken,
        metadata: accountDoc.metadata,
      };

      // 3. Prepare tailored content
      const content = target.platformContent || post.baseContent;
      const mediaUrls = target.mediaOverrides && target.mediaOverrides.length > 0 ? target.mediaOverrides : post.mediaUrls;

      const publishInput: PublishPostInput = {
        content,
        mediaUrls,
        linkUrl: target.options?.linkUrl,
        options: target.options,
      };

      // 4. Dispatch to platform provider
      const provider = this.socialProviderFactory.getProvider(platform);
      const result = await provider.publishPost(context, publishInput);

      if (result.success) {
        target.status = PostTargetStatus.PUBLISHED;
        target.externalPostId = result.platformPostId;
        target.externalPostUrl = result.platformPostUrl;
        target.errorMessage = null;
        target.publishedAt = result.publishedAt || new Date();
        this.logger.log(`Successfully published target [${platform}:${accountId}] -> ID: ${result.platformPostId}`);
      } else {
        target.status = PostTargetStatus.FAILED;
        target.errorMessage = result.errorMessage || 'Publishing rejected by platform.';
        target.retryCount = (target.retryCount || 0) + 1;
        target.lastRetryAt = new Date();
        this.logger.error(`Target [${platform}:${accountId}] failed: ${result.errorMessage}`);

        if (result.requiresReauth) {
          await this.flagAccountForReauth(post, accountId, accountDoc, target.errorMessage);
        }
      }
    } catch (error: any) {
      target.status = PostTargetStatus.FAILED;
      target.errorMessage = error.message || 'Execution exception occurred';
      target.retryCount = (target.retryCount || 0) + 1;
      target.lastRetryAt = new Date();
      this.logger.error(`Target [${target.platform}] error: ${error.message}`);
    }
  }

  private async flagAccountForReauth(post: PostDocument, accountId: string, accountDoc: any, reason: string) {
    try {
      await this.socialAccountsService.markNeedsReauth(accountId, reason);
      await this.notificationsService.sendNotification({
        userId: post.userId.toString(),
        workspaceId: post.workspaceId.toString(),
        title: `Reconnect your ${accountDoc.platform} account`,
        message: `"${accountDoc.accountName}" was disconnected by ${accountDoc.platform}. Reconnect it to keep publishing. ${reason}`,
        type: 'error',
        category: 'token_expiry',
        link: '/user/connected-accounts',
      });
    } catch (err: any) {
      this.logger.warn(`Failed to flag account ${accountId} for re-authentication: ${err.message}`);
    }
  }

  /**
   * Retries publishing for a specific failed target on a post.
   */
  async retryTarget(postId: string, accountId: string, userId: string): Promise<PostDocument> {
    const key = postId.toString();
    if (this.inFlight.has(key)) {
      throw new ConflictException('This post is already being published. Please wait a moment.');
    }
    this.inFlight.add(key);

    try {
      const post = await this.postModel
        .findOne({ _id: new Types.ObjectId(postId), isDeleted: false })
        .populate('targets.accountId');

      if (!post) throw new NotFoundException('Post not found.');

      const target = post.targets.find((t: any) => (t.accountId._id || t.accountId).toString() === accountId);
      if (!target) throw new NotFoundException('Target account not found on this post.');

      if (target.status === PostTargetStatus.PUBLISHED) {
        throw new BadRequestException('This platform has already been published successfully.');
      }

      this.logger.log(`Retrying target [${target.platform}:${accountId}] for post [${postId}] by user [${userId}]`);
      await this.publishToTarget(post, target);

      this.applyAggregateStatus(post);
      return await post.save();
    } finally {
      this.inFlight.delete(key);
    }
  }
}
