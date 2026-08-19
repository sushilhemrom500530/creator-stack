import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MetaTokenResponse,
  MetaLongLivedTokenResponse,
} from '../facebook/facebook.types';
import {
  FacebookPageWithInstagram,
  InstagramAccountsBridgeResponse,
  InstagramBusinessAccount,
} from './instagram.types';

@Injectable()
export class InstagramOAuth {
  private readonly logger = new Logger(InstagramOAuth.name);

  constructor(private readonly configService: ConfigService) {}

  private getAppId(): string {
    return (
      this.configService.get<string>('social.meta.appId') ||
      this.configService.get<string>('META_APP_ID') ||
      this.configService.get<string>('FACEBOOK_CLIENT_ID') ||
      ''
    );
  }

  private getAppSecret(): string {
    return (
      this.configService.get<string>('social.meta.appSecret') ||
      this.configService.get<string>('META_APP_SECRET') ||
      this.configService.get<string>('FACEBOOK_CLIENT_SECRET') ||
      ''
    );
  }

  private getDefaultCallbackUrl(): string {
    return (
      this.configService.get<string>('social.meta.instagramCallbackUrl') ||
      this.configService.get<string>('INSTAGRAM_REDIRECT_URI') ||
      this.configService.get<string>('social.meta.callbackUrl') ||
      this.configService.get<string>('META_CALLBACK_URL') ||
      'http://localhost:8080/api/v1/social-accounts/oauth/instagram/callback'
    );
  }

  private getGraphApiUrl(): string {
    const version = this.configService.get<string>('social.meta.graphVersion') || 'v21.0';
    return `https://graph.facebook.com/${version}`;
  }

  private getScopes(): string[] {
    return (
      this.configService.get<string[]>('social.meta.scopes.instagram') || [
        'instagram_basic',
        'instagram_content_publish',
        'instagram_manage_insights',
        'instagram_manage_comments',
        'pages_show_list',
        'pages_read_engagement',
      ]
    );
  }

  /**
   * Generates Meta OAuth dialog URL for Instagram permissions.
   */
  getAuthorizationUrl(state: string, redirectUri?: string): string {
    const appId = this.getAppId();
    if (!appId) {
      throw new BadRequestException('META_APP_ID is not configured in server environment.');
    }

    const callbackUrl = redirectUri || this.getDefaultCallbackUrl();
    const scopes = this.getScopes().join(',');
    const version = this.configService.get<string>('social.meta.graphVersion') || 'v21.0';

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: callbackUrl,
      state,
      scope: scopes,
      response_type: 'code',
    });

    return `https://www.facebook.com/${version}/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchanges code for short-lived user token.
   */
  async exchangeCodeForShortLivedToken(code: string, redirectUri?: string): Promise<MetaTokenResponse> {
    const appId = this.getAppId();
    const appSecret = this.getAppSecret();
    const callbackUrl = redirectUri || this.getDefaultCallbackUrl();

    const url = `${this.getGraphApiUrl()}/oauth/access_token`;
    const params = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: callbackUrl,
      code,
    });

    const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Instagram OAuth code exchange failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to exchange Instagram authorization code.');
    }

    return data as MetaTokenResponse;
  }

  /**
   * Upgrades short-lived token to 60-day Long-Lived User Access Token.
   */
  async exchangeForLongLivedUserToken(shortLivedToken: string): Promise<MetaLongLivedTokenResponse> {
    const appId = this.getAppId();
    const appSecret = this.getAppSecret();

    const url = `${this.getGraphApiUrl()}/oauth/access_token`;
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: shortLivedToken,
    });

    const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Instagram long-lived token exchange failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to upgrade to long-lived Instagram token.');
    }

    return data as MetaLongLivedTokenResponse;
  }

  /**
   * Discovers all Instagram Business/Creator accounts linked to the user's Facebook Pages.
   */
  async fetchLinkedInstagramAccounts(
    userAccessToken: string,
  ): Promise<Array<{ page: FacebookPageWithInstagram; instagramAccount: InstagramBusinessAccount }>> {
    const fields = [
      'id',
      'name',
      'access_token',
      'instagram_business_account{id,username,name,profile_picture_url,followers_count,media_count,biography,website}',
    ].join(',');

    const url = `${this.getGraphApiUrl()}/me/accounts?fields=${fields}&access_token=${userAccessToken}`;

    const response = await fetch(url, { method: 'GET' });
    const data: InstagramAccountsBridgeResponse = await response.json();

    if (!response.ok || (data as any).error) {
      const err = (data as any).error;
      this.logger.error(`Failed to fetch linked Instagram accounts: ${JSON.stringify(err || data)}`);
      throw new BadRequestException(err?.message || 'Failed to retrieve linked Instagram Business accounts.');
    }

    const linkedAccounts: Array<{ page: FacebookPageWithInstagram; instagramAccount: InstagramBusinessAccount }> = [];

    for (const page of data.data || []) {
      if (page.instagram_business_account) {
        linkedAccounts.push({
          page,
          instagramAccount: page.instagram_business_account,
        });
      }
    }

    return linkedAccounts;
  }
}
