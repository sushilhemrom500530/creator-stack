import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument, PostStatus } from '../posts/schemas/post.schema';
import { PublishingService } from '../publishing/publishing.service';
import { SocialAccount, SocialAccountDocument, SocialAccountStatus } from '../social-accounts/schemas/social-account.schema';
import { SocialAccountsService } from '../social-accounts/social-accounts.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private isProcessing = false;

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(SocialAccount.name) private readonly socialAccountModel: Model<SocialAccountDocument>,
    private readonly publishingService: PublishingService,
    private readonly socialAccountsService: SocialAccountsService,
  ) {}

  /**
   * Runs every 30 seconds to pick up scheduled posts that are due for publishing.
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async processDueScheduledPosts(): Promise<number> {
    if (this.isProcessing) {
      this.logger.debug('Scheduler job is already running, skipping cycle.');
      return 0;
    }

    this.isProcessing = true;
    const now = new Date();

    try {
      // Find all scheduled posts due for publishing
      const duePosts = await this.postModel.find({
        status: PostStatus.SCHEDULED,
        scheduledAt: { $lte: now },
        isDeleted: false,
      }).limit(50).exec();

      if (duePosts.length === 0) {
        return 0;
      }

      this.logger.log(`Found ${duePosts.length} due scheduled posts. Dispatching to Publishing Engine...`);

      let processedCount = 0;
      for (const post of duePosts) {
        try {
          // Lock status to PUBLISHING to prevent duplicate pickup
          post.status = PostStatus.PUBLISHING;
          await post.save();

          // Dispatch asynchronous publish
          await this.publishingService.publishPost(post._id);
          processedCount++;
        } catch (error: any) {
          this.logger.error(`Failed to publish scheduled post [${post._id}]: ${error.message}`);
        }
      }

      this.logger.log(`Successfully processed ${processedCount}/${duePosts.length} scheduled posts.`);
      return processedCount;
    } catch (error: any) {
      this.logger.error(`Error in scheduled posts processor: ${error.message}`);
      return 0;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Daily maintenance: checks for expiring tokens and triggers automatic refresh.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async processTokenRefresh(): Promise<void> {
    this.logger.log('Starting daily social account token health check...');
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    try {
      const expiringAccounts = await this.socialAccountModel.find({
        status: SocialAccountStatus.ACTIVE,
        tokenExpiresAt: { $ne: null, $lte: sevenDaysFromNow },
        isDeleted: false,
      }).exec();

      this.logger.log(`Found ${expiringAccounts.length} accounts with tokens expiring in the next 7 days.`);

      for (const account of expiringAccounts) {
        try {
          await this.socialAccountsService.refreshAccountToken(account._id.toString(), account.userId.toString());
          this.logger.log(`Auto-refreshed token for account [${account.platform}:${account.accountName}]`);
        } catch (err: any) {
          this.logger.warn(`Failed to auto-refresh token for [${account.platform}:${account.accountName}]: ${err.message}`);
        }
      }
    } catch (error: any) {
      this.logger.error(`Error in daily token refresh job: ${error.message}`);
    }
  }
}
