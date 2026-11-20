import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  FacebookPostResponse,
  FacebookPhotoResponse,
  FacebookVideoResponse,
  FacebookInsightsResponse,
  FacebookPageAccount,
  FacebookSendMessageResponse,
  FacebookUserProfile,
  FacebookConversationsResponse,
  FACEBOOK_PAGE_WEBHOOK_FIELDS,
} from './facebook.types';
import { FacebookGraphError } from './facebook.errors';

type HttpMethod = 'GET' | 'POST' | 'DELETE';

interface GraphRequestOptions {
  accessToken: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: Record<string, unknown>;
  fallbackError: string;
  /** Request timeout. Video uploads by URL can take a while on Meta's side. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;

@Injectable()
export class FacebookClient {
  private readonly logger = new Logger(FacebookClient.name);

  constructor(private readonly configService: ConfigService) {}

  private getGraphApiUrl(): string {
    const version = this.configService.get<string>('social.meta.graphVersion') || 'v21.0';
    return `https://graph.facebook.com/${version}`;
  }

  private getAppSecret(): string | undefined {
    return this.configService.get<string>('social.meta.appSecret') || undefined;
  }

  /**
   * appsecret_proof proves the call comes from our server. Required when
   * "Require App Secret" is enabled on the Meta app, harmless otherwise.
   */
  private buildAppSecretProof(accessToken: string): string | undefined {
    const secret = this.getAppSecret();
    if (!secret || !accessToken) return undefined;
    return crypto.createHmac('sha256', secret).update(accessToken).digest('hex');
  }

  /**
   * Single entry point for every Graph API call: adds auth + appsecret_proof,
   * enforces a timeout and normalises errors into FacebookGraphError.
   */
  private async graphRequest<T>(method: HttpMethod, path: string, options: GraphRequestOptions): Promise<T> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.query || {})) {
      if (value !== undefined && value !== null && value !== '') params.append(key, String(value));
    }
    params.append('access_token', options.accessToken);
    const proof = this.buildAppSecretProof(options.accessToken);
    if (proof) params.append('appsecret_proof', proof);

    const url = `${this.getGraphApiUrl()}/${path.replace(/^\//, '')}?${params.toString()}`;

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
      });
    } catch (error: any) {
      const reason = error?.name === 'TimeoutError' ? 'Facebook did not respond in time' : 'Could not reach Facebook';
      this.logger.error(`Graph ${method} /${path} network failure: ${error?.message}`);
      throw new FacebookGraphError(undefined, `${reason}. Please try again.`);
    }

    const data: any = await response.json().catch(() => ({}));

    if (!response.ok || data?.error) {
      const graphError = new FacebookGraphError(data?.error, options.fallbackError);
      this.logger.error(
        `Graph ${method} /${path.split('?')[0]} failed [code=${graphError.code} subcode=${graphError.subcode} trace=${graphError.fbtraceId}]: ${data?.error?.message || response.status}`,
      );
      throw graphError;
    }

    return data as T;
  }

  /**
   * Fetches full details for a single Facebook Page.
   */
  async getPageDetails(pageId: string, pageAccessToken: string): Promise<FacebookPageAccount> {
    return this.graphRequest<FacebookPageAccount>('GET', pageId, {
      accessToken: pageAccessToken,
      query: { fields: 'id,name,category,picture{url},fan_count,followers_count' },
      fallbackError: `Failed to fetch details for page ${pageId}`,
    });
  }

  /**
   * Publishes a text / link post to the Facebook Page feed.
   */
  async publishFeed(
    pageId: string,
    pageAccessToken: string,
    message: string,
    linkUrl?: string,
    scheduledPublishTime?: number,
    attachedMediaIds?: string[],
  ): Promise<FacebookPostResponse> {
    const body: Record<string, unknown> = { message };

    if (linkUrl) body.link = linkUrl;

    if (attachedMediaIds && attachedMediaIds.length > 0) {
      body.attached_media = attachedMediaIds.map((id) => ({ media_fbid: id }));
    }

    if (scheduledPublishTime) {
      body.published = false;
      body.scheduled_publish_time = scheduledPublishTime;
    }

    return this.graphRequest<FacebookPostResponse>('POST', `${pageId}/feed`, {
      accessToken: pageAccessToken,
      body,
      fallbackError: 'Failed to publish post to Facebook feed.',
    });
  }

  /**
   * Publishes a single photo post to the Facebook Page.
   * Pass `published: false` to upload a photo that will be attached to a multi-photo feed post.
   */
  async publishPhoto(
    pageId: string,
    pageAccessToken: string,
    photoUrl: string,
    caption?: string,
    published = true,
  ): Promise<FacebookPhotoResponse> {
    const body: Record<string, unknown> = { url: photoUrl };
    if (caption) body.caption = caption;
    if (!published) body.published = false;

    return this.graphRequest<FacebookPhotoResponse>('POST', `${pageId}/photos`, {
      accessToken: pageAccessToken,
      body,
      fallbackError: 'Failed to publish photo to Facebook.',
    });
  }

  /**
   * Publishes a video to the Facebook Page.
   */
  async publishVideo(
    pageId: string,
    pageAccessToken: string,
    videoUrl: string,
    description?: string,
    title?: string,
  ): Promise<FacebookVideoResponse> {
    const body: Record<string, unknown> = { file_url: videoUrl };
    if (description) body.description = description;
    if (title) body.title = title;

    return this.graphRequest<FacebookVideoResponse>('POST', `${pageId}/videos`, {
      accessToken: pageAccessToken,
      body,
      fallbackError: 'Failed to publish video to Facebook.',
      timeoutMs: 120_000,
    });
  }

  /**
   * Resolves the public permalink of a post/video. Best effort — returns undefined on failure.
   */
  async getPermalink(objectId: string, pageAccessToken: string): Promise<string | undefined> {
    try {
      const data = await this.graphRequest<{ permalink_url?: string }>('GET', objectId, {
        accessToken: pageAccessToken,
        query: { fields: 'permalink_url' },
        fallbackError: 'Failed to resolve permalink',
        timeoutMs: 10_000,
      });
      if (!data.permalink_url) return undefined;
      return data.permalink_url.startsWith('http')
        ? data.permalink_url
        : `https://www.facebook.com${data.permalink_url}`;
    } catch {
      return undefined;
    }
  }

  /**
   * Deletes a published post by external Post ID.
   */
  async deletePost(postId: string, pageAccessToken: string): Promise<boolean> {
    const data = await this.graphRequest<{ success?: boolean }>('DELETE', postId, {
      accessToken: pageAccessToken,
      fallbackError: `Failed to delete post ${postId}`,
    });
    return data.success === true;
  }

  /**
   * Fetches Page-level insights & analytics.
   */
  async getPageInsights(
    pageId: string,
    pageAccessToken: string,
    since?: number,
    until?: number,
  ): Promise<FacebookInsightsResponse> {
    const metrics = [
      'page_impressions',
      'page_impressions_unique',
      'page_engaged_users',
      'page_post_engagements',
    ].join(',');

    try {
      return await this.graphRequest<FacebookInsightsResponse>('GET', `${pageId}/insights`, {
        accessToken: pageAccessToken,
        query: { metric: metrics, since, until },
        fallbackError: 'Failed to fetch Facebook Page insights',
      });
    } catch (error: any) {
      this.logger.warn(`Failed to fetch Facebook Page insights: ${error.message}`);
      return { data: [] };
    }
  }

  // ─────────────────────────────── Webhooks ───────────────────────────────

  /**
   * Subscribes the Page to this app so Meta delivers Messenger + feed webhooks.
   * Requires the `pages_manage_metadata` permission.
   */
  async subscribePageToWebhooks(
    pageId: string,
    pageAccessToken: string,
    fields: readonly string[] = FACEBOOK_PAGE_WEBHOOK_FIELDS,
  ): Promise<boolean> {
    const data = await this.graphRequest<{ success?: boolean }>('POST', `${pageId}/subscribed_apps`, {
      accessToken: pageAccessToken,
      query: { subscribed_fields: fields.join(',') },
      fallbackError: 'Failed to subscribe the Facebook Page to webhooks.',
    });
    return data.success === true;
  }

  /**
   * Removes this app's webhook subscription from the Page (used on disconnect).
   */
  async unsubscribePageFromWebhooks(pageId: string, pageAccessToken: string): Promise<boolean> {
    const data = await this.graphRequest<{ success?: boolean }>('DELETE', `${pageId}/subscribed_apps`, {
      accessToken: pageAccessToken,
      fallbackError: 'Failed to unsubscribe the Facebook Page from webhooks.',
    });
    return data.success === true;
  }

  // ─────────────────────────────── Messenger ───────────────────────────────

  /**
   * Sends a Messenger text reply from the Page to a user (PSID).
   * Standard messaging is only allowed within 24h of the user's last message.
   */
  async sendMessengerText(
    pageId: string,
    pageAccessToken: string,
    recipientPsid: string,
    text: string,
  ): Promise<FacebookSendMessageResponse> {
    return this.graphRequest<FacebookSendMessageResponse>('POST', `${pageId}/messages`, {
      accessToken: pageAccessToken,
      body: {
        recipient: { id: recipientPsid },
        messaging_type: 'RESPONSE',
        message: { text },
      },
      fallbackError: 'Failed to send the Messenger reply.',
    });
  }

  /**
   * Fetches the public profile of a Messenger user (PSID). Returns null if not permitted.
   */
  async getMessengerUserProfile(psid: string, pageAccessToken: string): Promise<FacebookUserProfile | null> {
    try {
      return await this.graphRequest<FacebookUserProfile>('GET', psid, {
        accessToken: pageAccessToken,
        query: { fields: 'first_name,last_name,name,profile_pic' },
        fallbackError: 'Failed to fetch Messenger user profile',
        timeoutMs: 10_000,
      });
    } catch {
      return null;
    }
  }

  /**
   * Lists recent Messenger conversations of the Page, with their latest messages.
   */
  async getPageConversations(
    pageId: string,
    pageAccessToken: string,
    limit = 25,
    messagesPerConversation = 20,
  ): Promise<FacebookConversationsResponse> {
    return this.graphRequest<FacebookConversationsResponse>('GET', `${pageId}/conversations`, {
      accessToken: pageAccessToken,
      query: {
        platform: 'messenger',
        limit,
        fields: `participants,updated_time,messages.limit(${messagesPerConversation}){id,message,created_time,from,to,attachments{mime_type,name,image_data,video_data,file_url}}`,
      },
      fallbackError: 'Failed to load Messenger conversations.',
    });
  }
}
