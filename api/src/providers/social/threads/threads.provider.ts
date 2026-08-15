import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SocialPlatform } from 'src/modules/social-accounts/schemas/social-account.schema';
import { SocialProvider } from '../social-provider.interface';
import {
  TokenResult,
  SocialProfile,
  SocialAccountContext,
  PublishPostInput,
  PublishResult,
  AnalyticsParams,
  AnalyticsResult,
} from '../social-provider.types';
import { ThreadsOAuth } from './threads.oauth';
import { ThreadsClient } from './threads.client';

@Injectable()
export class ThreadsProvider implements SocialProvider {
  readonly platform = SocialPlatform.THREADS;
  private readonly logger = new Logger(ThreadsProvider.name);

  constructor(
    private readonly threadsOAuth: ThreadsOAuth,
    private readonly threadsClient: ThreadsClient,
  ) {}

  /**
   * Generates Threads OAuth Authorization URL.
   */
  getAuthorizationUrl(state: string, redirectUri?: string): string {
    return this.threadsOAuth.getAuthorizationUrl(state, redirectUri);
  }

  /**
   * Exchanges code for short-lived token -> long-lived 60-day Threads user token.
   */
  async exchangeCode(code: string, redirectUri?: string): Promise<TokenResult> {
    const shortLived = await this.threadsOAuth.exchangeCodeForShortLivedToken(code, redirectUri);
    const longLived = await this.threadsOAuth.exchangeForLongLivedToken(shortLived.access_token);
    const profile = await this.threadsClient.getUserProfile(longLived.access_token);

    const tokenExpiresAt = longLived.expires_in
      ? new Date(Date.now() + longLived.expires_in * 1000)
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    return {
      accessToken: longLived.access_token,
      refreshToken: longLived.access_token, // Threads uses the long-lived token itself for refresh grant
      expiresIn: longLived.expires_in,
      tokenExpiresAt,
      metadata: {
        threadsUserId: profile.id,
        threadsUsername: profile.username,
        threadsName: profile.name,
        profilePicture: profile.threads_profile_picture_url,
      },
    };
  }

  /**
   * Fetches Threads profile information.
   */
  async getAccount(accessToken: string): Promise<SocialProfile> {
    const profile = await this.threadsClient.getUserProfile(accessToken);

    return {
      platformAccountId: profile.id,
      accountName: profile.name || profile.username,
      username: profile.username,
      profilePictureUrl: profile.threads_profile_picture_url,
      metadata: {
        biography: profile.threads_biography,
      },
    };
  }

  /**
   * Refreshes long-lived Threads access token.
   */
  async refreshToken(longLivedToken: string): Promise<TokenResult> {
    const refreshed = await this.threadsOAuth.refreshLongLivedToken(longLivedToken);

    return {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.access_token,
      expiresIn: refreshed.expires_in,
      tokenExpiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
    };
  }

  /**
   * Publishes post (Text, Image, Video) to Threads.
   */
  async publishPost(account: SocialAccountContext, post: PublishPostInput): Promise<PublishResult> {
    const threadsUserId = account.platformAccountId || account.metadata?.threadsUserId;
    const accessToken = account.accessToken;

    if (!threadsUserId) {
      return {
        success: false,
        errorMessage: 'Threads User ID is missing in account configuration.',
      };
    }

    try {
      let containerId: string;
      const mediaUrls = post.mediaUrls || [];

      // 1. Create Media Container based on post content type
      if (mediaUrls.length > 0) {
        const firstMedia = mediaUrls[0];
        const isVideo = post.options?.isVideo || firstMedia.match(/\.(mp4|mov|avi)$/i);

        if (isVideo) {
          const videoRes = await this.threadsClient.createVideoContainer(
            threadsUserId,
            accessToken,
            firstMedia,
            post.content,
          );
          containerId = videoRes.id;
        } else {
          const imageRes = await this.threadsClient.createImageContainer(
            threadsUserId,
            accessToken,
            firstMedia,
            post.content,
          );
          containerId = imageRes.id;
        }
      } else {
        const textRes = await this.threadsClient.createTextContainer(
          threadsUserId,
          accessToken,
          post.content,
          post.linkUrl,
        );
        containerId = textRes.id;
      }

      // 2. Poll Container Status until ready
      await this.threadsClient.pollContainerStatus(containerId, accessToken);

      // 3. Publish the ready container
      const publishRes = await this.threadsClient.publishContainer(threadsUserId, accessToken, containerId);

      this.logger.log(`Successfully published Thread [${threadsUserId}]: ${publishRes.id}`);

      return {
        success: true,
        platformPostId: publishRes.id,
        platformPostUrl: `https://www.threads.net/post/${publishRes.id}`,
        publishedAt: new Date(),
      };
    } catch (error: any) {
      this.logger.error(`Threads publish failed: ${error.message}`);
      return {
        success: false,
        errorMessage: error.message || 'Unknown Threads publishing error',
      };
    }
  }

  /**
   * Fetches Threads analytics & metrics.
   */
  async getAnalytics(account: SocialAccountContext, params: AnalyticsParams): Promise<AnalyticsResult> {
    const threadsUserId = account.platformAccountId || account.metadata?.threadsUserId;
    if (!threadsUserId) {
      return { impressions: 0, reach: 0, engagements: 0, likes: 0, comments: 0, shares: 0, clicks: 0 };
    }

    const since = Math.floor(new Date(params.startDate).getTime() / 1000);
    const until = Math.floor(new Date(params.endDate).getTime() / 1000);

    const insights = await this.threadsClient.getUserInsights(
      threadsUserId,
      account.accessToken,
      since,
      until,
    );

    let impressions = 0;
    let likes = 0;
    let comments = 0;
    let shares = 0;

    for (const metric of insights.data || []) {
      const totalVal = metric.values?.reduce((sum, v) => sum + (v.value || 0), 0) || 0;
      if (metric.name === 'views') impressions = totalVal;
      if (metric.name === 'likes') likes = totalVal;
      if (metric.name === 'replies') comments = totalVal;
      if (metric.name === 'reposts' || metric.name === 'quotes') shares += totalVal;
    }

    return {
      impressions,
      reach: impressions,
      engagements: likes + comments + shares,
      likes,
      comments,
      shares,
      clicks: 0,
      rawMetrics: { insights: insights.data },
    };
  }
}
