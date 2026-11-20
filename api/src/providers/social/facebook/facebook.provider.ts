import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SocialPlatform } from '../../../modules/social-accounts/schemas/social-account.schema';
import { SocialProvider } from '../social-provider.interface';
import {
  TokenResult,
  SocialProfile,
  SocialAccountContext,
  SocialAccountRef,
  PublishPostInput,
  PublishResult,
  AnalyticsParams,
  AnalyticsResult,
  AccountConnectedResult,
} from '../social-provider.types';
import { FacebookOAuth } from './facebook.oauth';
import { FacebookClient } from './facebook.client';
import { FacebookGraphError } from './facebook.errors';
import {
  FacebookPageAccount,
  FACEBOOK_MESSAGING_PERMISSIONS,
  FACEBOOK_PAGE_WEBHOOK_FIELDS,
  FACEBOOK_REQUIRED_PUBLISH_PERMISSIONS,
} from './facebook.types';

const VIDEO_EXTENSIONS = /\.(mp4|mov|m4v|avi|wmv|webm|mkv|3gp)(\?|#|$)/i;

/** Facebook caps a single post's text at 63,206 characters. */
export const FACEBOOK_MAX_POST_LENGTH = 63206;
/** Practical cap for multi-photo posts (attached_media). */
export const FACEBOOK_MAX_PHOTOS = 10;

export function isFacebookVideoUrl(url: string): boolean {
  return VIDEO_EXTENSIONS.test(url) || /\/video\/upload\//i.test(url);
}

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
   * Exchanges code for short-lived token -> long-lived user token -> discovers the managed Page to connect.
   */
  async exchangeCode(code: string, redirectUri?: string): Promise<TokenResult> {
    // 1. Get short-lived user token
    const shortLived = await this.facebookOAuth.exchangeCodeForShortLivedToken(code, redirectUri);

    // 2. Exchange for 60-day long-lived user token
    const longLived = await this.facebookOAuth.exchangeForLongLivedUserToken(shortLived.access_token);

    // 3. Make sure the user did not untick permissions we cannot work without
    const granted = await this.facebookOAuth.fetchGrantedPermissions(longLived.access_token);
    if (granted) {
      const missing = FACEBOOK_REQUIRED_PUBLISH_PERMISSIONS.filter((p) => !granted.includes(p));
      if (missing.length > 0) {
        throw new BadRequestException(
          `Facebook did not grant the permissions needed to publish to your Page (${missing.join(', ')}). ` +
            'Please connect again and keep all requested permissions enabled.',
        );
      }
    }

    // 4. Fetch managed Facebook Pages with Page Access Tokens
    const pages = await this.facebookOAuth.fetchManagedPages(longLived.access_token);

    if (!pages || pages.length === 0) {
      throw new BadRequestException(
        'No Facebook Pages were shared with this app. Make sure you are an admin of at least one Page and select it in the Facebook permission dialog.',
      );
    }

    // Prefer the first Page where the user can actually create content.
    const primaryPage = this.pickPublishablePage(pages);
    const userTokenExpiresAt = longLived.expires_in
      ? new Date(Date.now() + longLived.expires_in * 1000)
      : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days fallback

    const missingMessagingPermissions = granted
      ? FACEBOOK_MESSAGING_PERMISSIONS.filter((p) => !granted.includes(p))
      : [];

    return {
      accessToken: primaryPage.access_token, // Page token derived from a long-lived user token does not expire
      refreshToken: longLived.access_token, // Long-lived user token, used to re-derive the Page token
      expiresIn: longLived.expires_in,
      tokenExpiresAt: null,
      scopes: granted || [],
      metadata: {
        pageId: primaryPage.id,
        pageName: primaryPage.name,
        category: primaryPage.category,
        pageTasks: primaryPage.tasks || [],
        userTokenExpiresAt: userTokenExpiresAt.toISOString(),
        missingMessagingPermissions,
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

  private pickPublishablePage(pages: FacebookPageAccount[]): FacebookPageAccount {
    return pages.find((p) => !p.tasks || p.tasks.includes('CREATE_CONTENT')) || pages[0];
  }

  /**
   * Retrieves profile details for the Facebook Page.
   */
  async getAccount(accessToken: string): Promise<SocialProfile> {
    // Meta /me with a Page Access Token resolves to the Facebook Page directly
    const details = await this.facebookClient.getPageDetails('me', accessToken);
    const followers = details.followers_count || details.fan_count || 0;

    return {
      platformAccountId: details.id,
      accountName: details.name,
      profilePictureUrl: details.picture?.data?.url,
      followersCount: followers,
      metadata: {
        category: details.category,
        fanCount: followers,
      },
    };
  }

  /**
   * Re-derives the Page Access Token for the connected Page using the long-lived User Token.
   */
  async refreshToken(userLongLivedToken: string, account?: SocialAccountRef): Promise<TokenResult> {
    const pages = await this.facebookOAuth.fetchManagedPages(userLongLivedToken);
    if (!pages || pages.length === 0) {
      throw new BadRequestException('Failed to refresh: No accessible Facebook Pages found.');
    }

    const page = account?.platformAccountId
      ? pages.find((p) => p.id === account.platformAccountId)
      : pages[0];

    if (!page) {
      throw new BadRequestException(
        'This Facebook Page is no longer accessible with your Facebook login. Please reconnect the Page.',
      );
    }

    return {
      accessToken: page.access_token,
      refreshToken: userLongLivedToken,
      tokenExpiresAt: null,
    };
  }

  /**
   * Subscribes the Page to Messenger + feed webhooks. Never throws: the connection itself
   * is still usable for publishing, so we only record the outcome.
   */
  async onAccountConnected(account: SocialAccountContext): Promise<AccountConnectedResult> {
    try {
      const ok = await this.facebookClient.subscribePageToWebhooks(account.platformAccountId, account.accessToken);
      return {
        metadata: {
          webhooksSubscribed: ok,
          webhookFields: ok ? [...FACEBOOK_PAGE_WEBHOOK_FIELDS] : [],
          webhookSubscribedAt: ok ? new Date().toISOString() : null,
          webhookError: ok ? null : 'Facebook did not confirm the webhook subscription.',
        },
      };
    } catch (error: any) {
      this.logger.warn(`Webhook subscription failed for Page [${account.platformAccountId}]: ${error.message}`);
      return {
        metadata: {
          webhooksSubscribed: false,
          webhookFields: [],
          webhookSubscribedAt: null,
          webhookError: error.message || 'Webhook subscription failed.',
        },
      };
    }
  }

  async onAccountDisconnected(account: SocialAccountContext): Promise<void> {
    try {
      await this.facebookClient.unsubscribePageFromWebhooks(account.platformAccountId, account.accessToken);
    } catch (error: any) {
      this.logger.warn(`Webhook unsubscribe failed for Page [${account.platformAccountId}]: ${error.message}`);
    }
  }

  /**
   * Publishes post to Facebook Page: video, single photo, multi-photo album post, or text/link post.
   */
  async publishPost(account: SocialAccountContext, post: PublishPostInput): Promise<PublishResult> {
    const pageId = account.platformAccountId;
    const pageAccessToken = account.accessToken;
    const mediaUrls = (post.mediaUrls || []).filter(Boolean);
    const content = post.content || '';

    try {
      if (content.length > FACEBOOK_MAX_POST_LENGTH) {
        throw new BadRequestException(`Facebook posts are limited to ${FACEBOOK_MAX_POST_LENGTH} characters.`);
      }

      let resultId: string;
      let fallbackUrl: string;

      const hasVideo = mediaUrls.length > 0 && (post.options?.isVideo || mediaUrls.some(isFacebookVideoUrl));

      if (hasVideo) {
        if (mediaUrls.length > 1) {
          throw new BadRequestException('Facebook video posts support exactly one video and no extra photos.');
        }
        const videoRes = await this.facebookClient.publishVideo(
          pageId,
          pageAccessToken,
          mediaUrls[0],
          content,
          post.options?.title,
        );
        resultId = videoRes.id;
        fallbackUrl = `https://www.facebook.com/${pageId}/videos/${videoRes.id}`;
      } else if (mediaUrls.length > 1) {
        if (mediaUrls.length > FACEBOOK_MAX_PHOTOS) {
          throw new BadRequestException(`Facebook posts support up to ${FACEBOOK_MAX_PHOTOS} photos.`);
        }
        // Upload photos unpublished (order preserved), then attach them to a single feed post.
        const uploaded = await Promise.all(
          mediaUrls.map((url) => this.facebookClient.publishPhoto(pageId, pageAccessToken, url, undefined, false)),
        );
        const feedRes = await this.facebookClient.publishFeed(
          pageId,
          pageAccessToken,
          content,
          undefined,
          undefined,
          uploaded.map((p) => p.id),
        );
        resultId = feedRes.id;
        fallbackUrl = `https://www.facebook.com/${feedRes.id}`;
      } else if (mediaUrls.length === 1) {
        const photoRes = await this.facebookClient.publishPhoto(pageId, pageAccessToken, mediaUrls[0], content);
        resultId = photoRes.post_id || photoRes.id;
        fallbackUrl = `https://www.facebook.com/${resultId}`;
      } else {
        if (!content.trim() && !post.linkUrl) {
          throw new BadRequestException('A Facebook post needs text, a link, or media.');
        }
        const feedRes = await this.facebookClient.publishFeed(
          pageId,
          pageAccessToken,
          content,
          post.linkUrl,
          post.scheduledAt ? Math.floor(new Date(post.scheduledAt).getTime() / 1000) : undefined,
        );
        resultId = feedRes.id;
        fallbackUrl = `https://www.facebook.com/${feedRes.id}`;
      }

      const permalink = await this.facebookClient.getPermalink(resultId, pageAccessToken);

      this.logger.log(`Successfully published post to Facebook Page [${pageId}]: ${resultId}`);

      return {
        success: true,
        platformPostId: resultId,
        platformPostUrl: permalink || fallbackUrl,
        publishedAt: new Date(),
      };
    } catch (error: any) {
      this.logger.error(`Facebook post publishing failed: ${error.message}`);
      const graphError = error instanceof FacebookGraphError ? error : undefined;
      return {
        success: false,
        errorMessage: error.message || 'Unknown Facebook publishing error',
        errorCode: graphError?.code !== undefined ? String(graphError.code) : undefined,
        requiresReauth: graphError?.requiresReauth || false,
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
