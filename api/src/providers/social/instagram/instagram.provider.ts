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
import { InstagramOAuth } from './instagram.oauth';
import { InstagramClient } from './instagram.client';

@Injectable()
export class InstagramProvider implements SocialProvider {
  readonly platform = SocialPlatform.INSTAGRAM;
  private readonly logger = new Logger(InstagramProvider.name);

  constructor(
    private readonly instagramOAuth: InstagramOAuth,
    private readonly instagramClient: InstagramClient,
  ) {}

  /**
   * Generates Instagram OAuth Authorization URL.
   */
  getAuthorizationUrl(state: string, redirectUri?: string): string {
    return this.instagramOAuth.getAuthorizationUrl(state, redirectUri);
  }

  /**
   * Exchanges code for short-lived token -> long-lived user token -> discovers linked Instagram Business accounts.
   */
  async exchangeCode(code: string, redirectUri?: string): Promise<TokenResult> {
    const shortLived = await this.instagramOAuth.exchangeCodeForShortLivedToken(code, redirectUri);
    const longLived = await this.instagramOAuth.exchangeForLongLivedUserToken(shortLived.access_token);

    const linked = await this.instagramOAuth.fetchLinkedInstagramAccounts(longLived.access_token);

    if (!linked || linked.length === 0) {
      throw new BadRequestException(
        'No Instagram Professional or Creator accounts found. Please ensure your Instagram account is switched to Professional/Creator and linked to a Facebook Page.',
      );
    }

    // Default to the first linked Instagram account
    const primary = linked[0];
    const tokenExpiresAt = longLived.expires_in
      ? new Date(Date.now() + longLived.expires_in * 1000)
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    return {
      accessToken: primary.page.access_token, // Permanent Page Access Token manages the linked Instagram account
      refreshToken: longLived.access_token, // Long-Lived User Token
      expiresIn: longLived.expires_in,
      tokenExpiresAt,
      metadata: {
        instagramUserId: primary.instagramAccount.id,
        instagramUsername: primary.instagramAccount.username,
        instagramName: primary.instagramAccount.name,
        facebookPageId: primary.page.id,
        facebookPageName: primary.page.name,
        discoveredAccounts: linked.map((l) => ({
          igId: l.instagramAccount.id,
          igUsername: l.instagramAccount.username,
          igName: l.instagramAccount.name,
          profilePicture: l.instagramAccount.profile_picture_url,
          followers: l.instagramAccount.followers_count || 0,
          pageId: l.page.id,
          pageName: l.page.name,
        })),
      },
    };
  }

  /**
   * Fetches Instagram Profile information.
   */
  async getAccount(accessToken: string): Promise<SocialProfile> {
    // When connecting Instagram, the metadata contains the igUserId.
    // However, if called with accessToken directly, we query the linked Instagram details
    return {
      platformAccountId: '', // Populated by service using metadata.instagramUserId
      accountName: 'Instagram Business',
      username: '',
    };
  }

  /**
   * Refreshes Instagram access tokens.
   */
  async refreshToken(userLongLivedToken: string): Promise<TokenResult> {
    const linked = await this.instagramOAuth.fetchLinkedInstagramAccounts(userLongLivedToken);
    if (!linked || linked.length === 0) {
      throw new BadRequestException('Failed to refresh Instagram account: No linked business accounts found.');
    }

    const primary = linked[0];
    return {
      accessToken: primary.page.access_token,
      refreshToken: userLongLivedToken,
      tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    };
  }

  /**
   * Publishes media to Instagram via two-step container pipeline.
   */
  async publishPost(account: SocialAccountContext, post: PublishPostInput): Promise<PublishResult> {
    const igUserId = account.platformAccountId || account.metadata?.instagramUserId;
    const pageAccessToken = account.accessToken;

    if (!igUserId) {
      return {
        success: false,
        errorMessage: 'Instagram User ID is missing in account configuration.',
      };
    }

    if (!post.mediaUrls || post.mediaUrls.length === 0) {
      return {
        success: false,
        errorMessage: 'Instagram requires at least one image or video to publish a post.',
      };
    }

    try {
      const mediaUrl = post.mediaUrls[0];
      const isVideo = post.options?.isVideo || mediaUrl.match(/\.(mp4|mov|avi)$/i);
      let containerId: string;

      // 1. Create Media Container
      if (isVideo) {
        const isReel = post.options?.isReel !== false; // Default to Reel format
        const containerRes = await this.instagramClient.createVideoContainer(
          igUserId,
          pageAccessToken,
          mediaUrl,
          post.content,
          isReel,
        );
        containerId = containerRes.id;
      } else {
        const containerRes = await this.instagramClient.createImageContainer(
          igUserId,
          pageAccessToken,
          mediaUrl,
          post.content,
        );
        containerId = containerRes.id;
      }

      // 2. Poll Container Status until ready (video transcoding or image validation)
      await this.instagramClient.pollContainerStatus(containerId, pageAccessToken);

      // 3. Publish the ready container
      const publishRes = await this.instagramClient.publishContainer(igUserId, pageAccessToken, containerId);

      this.logger.log(`Successfully published Instagram post [${igUserId}]: ${publishRes.id}`);

      return {
        success: true,
        platformPostId: publishRes.id,
        platformPostUrl: `https://www.instagram.com/p/${publishRes.id}`,
        publishedAt: new Date(),
      };
    } catch (error: any) {
      this.logger.error(`Instagram publish failed: ${error.message}`);
      return {
        success: false,
        errorMessage: error.message || 'Unknown Instagram publishing error',
      };
    }
  }

  /**
   * Retrieves Instagram Analytics and Metrics.
   */
  async getAnalytics(account: SocialAccountContext, params: AnalyticsParams): Promise<AnalyticsResult> {
    const igUserId = account.platformAccountId || account.metadata?.instagramUserId;
    if (!igUserId) {
      return { impressions: 0, reach: 0, engagements: 0, likes: 0, comments: 0, shares: 0, clicks: 0 };
    }

    const since = Math.floor(new Date(params.startDate).getTime() / 1000);
    const until = Math.floor(new Date(params.endDate).getTime() / 1000);

    const insights = await this.instagramClient.getAccountInsights(
      igUserId,
      account.accessToken,
      since,
      until,
    );

    let impressions = 0;
    let reach = 0;
    let engagements = 0;

    for (const metric of insights.data || []) {
      const totalVal = metric.values?.reduce((sum, v) => sum + (v.value || 0), 0) || 0;
      if (metric.name === 'impressions') impressions = totalVal;
      if (metric.name === 'reach') reach = totalVal;
      if (metric.name === 'total_interactions') engagements = totalVal;
    }

    return {
      impressions,
      reach,
      engagements,
      likes: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      rawMetrics: { insights: insights.data },
    };
  }
}
