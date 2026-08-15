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
import { FacebookOAuth } from './facebook.oauth';
import { FacebookClient } from './facebook.client';

@Injectable()
export class FacebookProvider implements SocialProvider {
  readonly platform = SocialPlatform.FACEBOOK;
  private readonly logger = new Logger(FacebookProvider.name);

  constructor(
    private readonly facebookOAuth: FacebookOAuth,
    private readonly facebookClient: FacebookClient,
  ) {}

  /**
   * Generates Facebook OAuth URL.
   */
  getAuthorizationUrl(state: string, redirectUri?: string): string {
    return this.facebookOAuth.getAuthorizationUrl(state, redirectUri);
  }

  /**
   * Exchanges code for short-lived token -> long-lived user token -> discovers primary/first managed Page.
   */
  async exchangeCode(code: string, redirectUri?: string): Promise<TokenResult> {
    // 1. Get short-lived user token
    const shortLived = await this.facebookOAuth.exchangeCodeForShortLivedToken(code, redirectUri);

    // 2. Exchange for 60-day long-lived user token
    const longLived = await this.facebookOAuth.exchangeForLongLivedUserToken(shortLived.access_token);

    // 3. Fetch managed Facebook Pages with permanent Page Access Tokens
    const pages = await this.facebookOAuth.fetchManagedPages(longLived.access_token);

    if (!pages || pages.length === 0) {
      throw new BadRequestException(
        'No managed Facebook Pages found. You must be an admin or manager of at least one Facebook Page to connect.',
      );
    }

    // Default to the first managed page (or primary)
    const primaryPage = pages[0];
    const tokenExpiresAt = longLived.expires_in
      ? new Date(Date.now() + longLived.expires_in * 1000)
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days fallback

    return {
      accessToken: primaryPage.access_token, // Permanent Page Access Token
      refreshToken: longLived.access_token, // Store Long-Lived User Token as refresh token
      expiresIn: longLived.expires_in,
      tokenExpiresAt,
      scopes: primaryPage.tasks || [],
      metadata: {
        pageId: primaryPage.id,
        pageName: primaryPage.name,
        category: primaryPage.category,
        discoveredPages: pages.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          picture: p.picture?.data?.url,
          fanCount: p.fan_count || p.followers_count || 0,
        })),
      },
    };
  }

  /**
   * Retrieves profile details for the Facebook Page.
   */
  async getAccount(accessToken: string): Promise<SocialProfile> {
    // Meta /me with a Page Access Token resolves to the Facebook Page directly
    const details = await this.facebookClient.getPageDetails('me', accessToken);

    return {
      platformAccountId: details.id,
      accountName: details.name,
      profilePictureUrl: details.picture?.data?.url,
      metadata: {
        category: details.category,
        fanCount: details.fan_count || details.followers_count || 0,
      },
    };
  }

  /**
   * Refreshes Page Access Token using long-lived User Token.
   */
  async refreshToken(userLongLivedToken: string): Promise<TokenResult> {
    const pages = await this.facebookOAuth.fetchManagedPages(userLongLivedToken);
    if (!pages || pages.length === 0) {
      throw new BadRequestException('Failed to refresh: No accessible Facebook Pages found.');
    }

    const primaryPage = pages[0];
    return {
      accessToken: primaryPage.access_token,
      refreshToken: userLongLivedToken,
      tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    };
  }

  /**
   * Publishes post to Facebook Page.
   */
  async publishPost(account: SocialAccountContext, post: PublishPostInput): Promise<PublishResult> {
    const pageId = account.platformAccountId;
    const pageAccessToken = account.accessToken;

    try {
      let resultId: string;

      // Video post
      if (post.mediaUrls && post.mediaUrls.length > 0 && post.options?.isVideo) {
        const videoRes = await this.facebookClient.publishVideo(
          pageId,
          pageAccessToken,
          post.mediaUrls[0],
          post.content,
          post.options?.title,
        );
        resultId = videoRes.id;
      }
      // Photo post
      else if (post.mediaUrls && post.mediaUrls.length > 0) {
        const photoRes = await this.facebookClient.publishPhoto(
          pageId,
          pageAccessToken,
          post.mediaUrls[0],
          post.content,
        );
        resultId = photoRes.post_id || photoRes.id;
      }
      // Text or Link post
      else {
        const feedRes = await this.facebookClient.publishFeed(
          pageId,
          pageAccessToken,
          post.content,
          post.linkUrl,
          post.scheduledAt ? Math.floor(new Date(post.scheduledAt).getTime() / 1000) : undefined,
        );
        resultId = feedRes.id;
      }

      this.logger.log(`Successfully published post to Facebook Page [${pageId}]: ${resultId}`);

      return {
        success: true,
        platformPostId: resultId,
        platformPostUrl: `https://www.facebook.com/${resultId}`,
        publishedAt: new Date(),
      };
    } catch (error: any) {
      this.logger.error(`Facebook post publishing failed: ${error.message}`);
      return {
        success: false,
        errorMessage: error.message || 'Unknown Facebook publishing error',
      };
    }
  }

  /**
   * Deletes a published post from Facebook.
   */
  async deletePost(account: SocialAccountContext, externalPostId: string): Promise<void> {
    await this.facebookClient.deletePost(externalPostId, account.accessToken);
  }

  /**
   * Aggregates Page insights and engagement statistics.
   */
  async getAnalytics(account: SocialAccountContext, params: AnalyticsParams): Promise<AnalyticsResult> {
    const since = Math.floor(new Date(params.startDate).getTime() / 1000);
    const until = Math.floor(new Date(params.endDate).getTime() / 1000);

    const insights = await this.facebookClient.getPageInsights(
      account.platformAccountId,
      account.accessToken,
      since,
      until,
    );

    let impressions = 0;
    let reach = 0;
    let engagements = 0;

    for (const metric of insights.data) {
      const latestValue = metric.values[metric.values.length - 1]?.value;
      const numericVal = typeof latestValue === 'number' ? latestValue : 0;

      if (metric.name === 'page_impressions') impressions = numericVal;
      if (metric.name === 'page_impressions_unique') reach = numericVal;
      if (metric.name === 'page_engaged_users' || metric.name === 'page_post_engagements') {
        engagements += numericVal;
      }
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
