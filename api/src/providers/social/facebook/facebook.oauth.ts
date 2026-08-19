import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MetaTokenResponse,
  MetaLongLivedTokenResponse,
  FacebookAccountsResponse,
  FacebookPageAccount,
} from './facebook.types';

@Injectable()
export class FacebookOAuth {
  private readonly logger = new Logger(FacebookOAuth.name);

  constructor(private readonly configService: ConfigService) { }

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
      this.configService.get<string>('social.meta.callbackUrl') ||
      this.configService.get<string>('FACEBOOK_REDIRECT_URI') ||
      this.configService.get<string>('META_CALLBACK_URL') ||
      'http://localhost:8080/api/v1/social-accounts/oauth/facebook/callback'
    );
  }

  private getGraphApiUrl(): string {
    const version = this.configService.get<string>('social.meta.graphVersion') || 'v21.0';
    return `https://graph.facebook.com/${version}`;
  }

  private getScopes(): string[] {
    return (
      this.configService.get<string[]>('social.meta.scopes.facebook') || [
        'public_profile',
        'pages_show_list',
        'pages_read_engagement',
      ]
    );
  }

  /**
   * Generates Meta OAuth dialog URL.
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
   * Exchanges authorization code for a short-lived user access token.
   */
  async exchangeCodeForShortLivedToken(code: string, redirectUri?: string): Promise<MetaTokenResponse> {
    const appId = this.getAppId();
    const appSecret = this.getAppSecret();
    const callbackUrl = redirectUri || this.getDefaultCallbackUrl();

    if (!appId || !appSecret) {
      throw new BadRequestException('Meta App ID or App Secret is missing in configuration.');
    }

    const url = `${this.getGraphApiUrl()}/oauth/access_token`;
    const params = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: callbackUrl,
      code,
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
      const data = await response.json();

      if (!response.ok || data.error) {
        this.logger.error(`Facebook OAuth code exchange failed: ${JSON.stringify(data.error || data)}`);
        throw new BadRequestException(data.error?.message || 'Failed to exchange Facebook authorization code.');
      }

      return data as MetaTokenResponse;
    } catch (error: any) {
      this.logger.error(`Failed to exchange Facebook code: ${error.message}`);
      throw new BadRequestException(error.message || 'Facebook token exchange request failed.');
    }
  }

  /**
   * Exchanges short-lived User Token for a 60-day Long-Lived User Access Token.
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

    try {
      const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
      const data = await response.json();

      if (!response.ok || data.error) {
        this.logger.error(`Facebook long-lived token exchange failed: ${JSON.stringify(data.error || data)}`);
        throw new BadRequestException(data.error?.message || 'Failed to exchange for long-lived Facebook token.');
      }

      return data as MetaLongLivedTokenResponse;
    } catch (error: any) {
      this.logger.error(`Long-lived token exchange failed: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Fetches all Facebook Pages managed by the authenticated user with permanent Page Access Tokens.
   */
  async fetchManagedPages(userAccessToken: string): Promise<FacebookPageAccount[]> {
    const url = `${this.getGraphApiUrl()}/me/accounts?fields=id,name,category,access_token,tasks,picture{url},fan_count,followers_count&access_token=${userAccessToken}`;

    try {
      const response = await fetch(url, { method: 'GET' });
      const data: FacebookAccountsResponse = await response.json();

      if (!response.ok || (data as any).error) {
        const err = (data as any).error;
        this.logger.error(`Failed to fetch Facebook Pages: ${JSON.stringify(err || data)}`);
        throw new BadRequestException(err?.message || 'Failed to fetch managed Facebook Pages.');
      }

      return data.data || [];
    } catch (error: any) {
      this.logger.error(`Failed to retrieve managed pages: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}
