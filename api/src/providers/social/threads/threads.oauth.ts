import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThreadsTokenResponse,
  ThreadsLongLivedTokenResponse,
} from './threads.types';

@Injectable()
export class ThreadsOAuth {
  private readonly logger = new Logger(ThreadsOAuth.name);

  constructor(private readonly configService: ConfigService) { }

  private getAppId(): string {
    return (
      this.configService.get<string>('social.meta.threadsAppId') ||
      this.configService.get<string>('THREADS_CLIENT_ID') ||
      this.configService.get<string>('THREAD_APP_ID') ||
      this.configService.get<string>('social.meta.appId') ||
      this.configService.get<string>('META_APP_ID') ||
      ''
    );
  }

  private getAppSecret(): string {
    return (
      this.configService.get<string>('social.meta.threadsAppSecret') ||
      this.configService.get<string>('THREADS_CLIENT_SECRET') ||
      this.configService.get<string>('THREAD_APP_SECRET') ||
      this.configService.get<string>('social.meta.appSecret') ||
      this.configService.get<string>('META_APP_SECRET') ||
      ''
    );
  }

  private getDefaultCallbackUrl(): string {
    return (
      this.configService.get<string>('social.meta.threadsCallbackUrl') ||
      this.configService.get<string>('THREADS_REDIRECT_URI') ||
      this.configService.get<string>('social.meta.callbackUrl') ||
      'http://localhost:8080/api/v1/social-accounts/oauth/threads/callback'
    );
  }

  private getScopes(): string[] {
    return (
      this.configService.get<string[]>('social.meta.scopes.threads') || [
        'threads_basic',
        'threads_content_publish',
        'threads_read_replies',
        'threads_manage_replies',
        'threads_manage_insights',
      ]
    );
  }

  /**
   * Generates Threads OAuth Authorization URL.
   */
  getAuthorizationUrl(state: string, redirectUri?: string): string {
    const appId = this.getAppId();
    if (!appId) {
      throw new BadRequestException('META_APP_ID is not configured in server environment.');
    }

    const callbackUrl = redirectUri || this.getDefaultCallbackUrl();
    const scopes = this.getScopes().join(',');

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: callbackUrl,
      scope: scopes,
      response_type: 'code',
      state,
    });

    return `https://threads.net/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchanges authorization code for short-lived Threads user token.
   */
  async exchangeCodeForShortLivedToken(code: string, redirectUri?: string): Promise<ThreadsTokenResponse> {
    const appId = this.getAppId();
    const appSecret = this.getAppSecret();
    const callbackUrl = redirectUri || this.getDefaultCallbackUrl();

    const url = 'https://graph.threads.net/oauth/access_token';
    const body = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: 'authorization_code',
      redirect_uri: callbackUrl,
      code,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Threads OAuth code exchange failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to exchange Threads authorization code.');
    }

    return data as ThreadsTokenResponse;
  }

  /**
   * Upgrades short-lived token to a 60-day Long-Lived Threads Token.
   */
  async exchangeForLongLivedToken(shortLivedToken: string): Promise<ThreadsLongLivedTokenResponse> {
    const appSecret = this.getAppSecret();
    const url = 'https://graph.threads.net/access_token';

    const params = new URLSearchParams({
      grant_type: 'th_exchange_token',
      client_secret: appSecret,
      access_token: shortLivedToken,
    });

    const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Threads long-lived token exchange failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to obtain long-lived Threads token.');
    }

    return data as ThreadsLongLivedTokenResponse;
  }

  /**
   * Refreshes a long-lived Threads token (valid for another 60 days).
   */
  async refreshLongLivedToken(longLivedToken: string): Promise<ThreadsLongLivedTokenResponse> {
    const url = 'https://graph.threads.net/refresh_access_token';

    const params = new URLSearchParams({
      grant_type: 'th_refresh_token',
      access_token: longLivedToken,
    });

    const response = await fetch(`${url}?${params.toString()}`, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Threads token refresh failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to refresh Threads access token.');
    }

    return data as ThreadsLongLivedTokenResponse;
  }
}
