import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument, PostStatus, PostTargetStatus } from '../posts/schemas/post.schema';
import { SocialAccountsService } from '../social-accounts/social-accounts.service';
import { SocialProviderFactory } from 'src/providers/social/social-provider.factory';
import { SocialAccountContext, PublishPostInput } from 'src/providers/social/social-provider.types';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PublishingService {
  private readonly logger = new Logger(PublishingService.name);

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly socialAccountsService: SocialAccountsService,
    private readonly socialProviderFactory: SocialProviderFactory,
    private readonly notificationsService: NotificationsService,
  ) { }

  /**
   * Core multi-platform publishing engine.
   * Dispatches post across all targeted social networks in parallel with isolated error handling.
   */
  async publishPost(postId: string | Types.ObjectId): Promise<PostDocument> {
    const post = await this.postModel
      .findOne({ _id: new Types.ObjectId(postId), isDeleted: false })
      .populate('targets.accountId');

    if (!post) {
      throw new NotFoundException(`Post [${postId}] not found for publishing.`);
    }

    if (post.status === PostStatus.PUBLISHED) {
      throw new BadRequestException(`Post [${postId}] has already been published.`);
    }

    post.status = PostStatus.PUBLISHING;
    await post.save();

    this.logger.log(`Starting multi-platform publishing for post [${postId}] across ${post.targets.length} targets.`);

    // Execute publishing across all platforms in parallel
    const publishPromises = post.targets.map((target) => this.publishToTarget(post, target));
    await Promise.allSettled(publishPromises);

    // Re-evaluate overall post status
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

    const saved = await post.save();
    this.logger.log(`Completed publishing for post [${postId}]. Final status: [${saved.status}]`);

    // Send notification
    try {
      if (saved.status === PostStatus.PUBLISHED) {
        await this.notificationsService.sendNotification({
          userId: post.userId.toString(),
          title: 'Post Published Successfully 🚀',
          message: `Your post was published across ${post.targets.length} platforms.`,
        });
      } else if (saved.status === PostStatus.PARTIALLY_PUBLISHED || saved.status === PostStatus.FAILED) {
        await this.notificationsService.sendNotification({
          userId: post.userId.toString(),
          title: 'Post Publishing Issues ⚠️',
          message: `One or more social platforms failed during post dispatch. Check post details to retry.`,
        });
      }
    } catch (err: any) {
      this.logger.warn(`Failed to dispatch notification: ${err.message}`);
    }

    return saved;
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
      }
    } catch (error: any) {
      target.status = PostTargetStatus.FAILED;
      target.errorMessage = error.message || 'Execution exception occurred';
      target.retryCount = (target.retryCount || 0) + 1;
      target.lastRetryAt = new Date();
      this.logger.error(`Target [${target.platform}] error: ${error.message}`);
    }
  }

  /**
   * Retries publishing for a specific failed target on a post.
   */
  async retryTarget(postId: string, accountId: string, userId: string): Promise<PostDocument> {
    const post = await this.postModel
      .findOne({ _id: new Types.ObjectId(postId), isDeleted: false })
      .populate('targets.accountId');

    if (!post) throw new NotFoundException('Post not found.');

    const target = post.targets.find((t) => (t.accountId._id || t.accountId).toString() === accountId);
    if (!target) throw new NotFoundException('Target account not found on this post.');

    this.logger.log(`Retrying target [${target.platform}:${accountId}] for post [${postId}]`);
    await this.publishToTarget(post, target);

    // Recompute overall post status
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

    return post.save();
  }
}
