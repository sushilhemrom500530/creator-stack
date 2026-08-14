import { SocialPlatform } from 'src/modules/social-accounts/schemas/social-account.schema';
import {
  TokenResult,
  SocialProfile,
  SocialAccountContext,
  PublishPostInput,
  PublishResult,
  AnalyticsParams,
  AnalyticsResult,
} from './social-provider.types';

export interface SocialProvider {
  readonly platform: SocialPlatform;

  /**
   * Generates the OAuth authorization URL with CSRF state and redirectUri.
   */
  getAuthorizationUrl(state: string, redirectUri?: string): string;

  /**
   * Exchanges an authorization code for short/long-lived access tokens.
   */
  exchangeCode(code: string, redirectUri?: string): Promise<TokenResult>;

  /**
   * Fetches the user or page profile information using the access token.
   */
  getAccount(accessToken: string): Promise<SocialProfile>;

  /**
   * Refreshes an expired or expiring access token if supported by the platform.
   */
  refreshToken?(refreshToken: string): Promise<TokenResult>;

  /**
   * Publishes a post (text, link, media) to the target social account.
   */
  publishPost(account: SocialAccountContext, post: PublishPostInput): Promise<PublishResult>;

  /**
   * Deletes a published post by external platform post ID.
   */
  deletePost?(account: SocialAccountContext, externalPostId: string): Promise<void>;

  /**
   * Fetches analytics & metrics for a given account.
   */
  getAnalytics?(account: SocialAccountContext, params: AnalyticsParams): Promise<AnalyticsResult>;
}
