import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  FacebookPostResponse,
  FacebookPhotoResponse,
  FacebookVideoResponse,
  FacebookInsightsResponse,
  FacebookPageAccount,
} from './facebook.types';

@Injectable()
export class FacebookClient {
  private readonly logger = new Logger(FacebookClient.name);

  constructor(private readonly configService: ConfigService) {}

  private getGraphApiUrl(): string {
    const version = this.configService.get<string>('social.meta.graphVersion') || 'v21.0';
    return `https://graph.facebook.com/${version}`;
  }

  /**
   * Fetches full details for a single Facebook Page.
   */
  async getPageDetails(pageId: string, pageAccessToken: string): Promise<FacebookPageAccount> {
    const url = `${this.getGraphApiUrl()}/${pageId}?fields=id,name,category,picture{url},fan_count,followers_count&access_token=${pageAccessToken}`;

    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new BadRequestException(data.error?.message || `Failed to fetch details for page ${pageId}`);
    }

    return data as FacebookPageAccount;
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
  ): Promise<FacebookPostResponse> {
    const url = `${this.getGraphApiUrl()}/${pageId}/feed`;

    const body: Record<string, any> = {
      message,
      access_token: pageAccessToken,
    };

    if (linkUrl) {
      body.link = linkUrl;
    }

    if (scheduledPublishTime) {
      body.published = false;
      body.scheduled_publish_time = scheduledPublishTime;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Facebook Feed publish failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to publish post to Facebook feed.');
    }

    return data as FacebookPostResponse;
  }

  /**
   * Publishes a single photo post to the Facebook Page.
   */
  async publishPhoto(
    pageId: string,
    pageAccessToken: string,
    photoUrl: string,
    caption?: string,
  ): Promise<FacebookPhotoResponse> {
    const url = `${this.getGraphApiUrl()}/${pageId}/photos`;

    const body: Record<string, any> = {
      url: photoUrl,
      access_token: pageAccessToken,
    };

    if (caption) {
      body.caption = caption;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Facebook Photo publish failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to publish photo to Facebook.');
    }

    return data as FacebookPhotoResponse;
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
    const url = `${this.getGraphApiUrl()}/${pageId}/videos`;

    const body: Record<string, any> = {
      file_url: videoUrl,
      access_token: pageAccessToken,
    };

    if (description) body.description = description;
    if (title) body.title = title;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Facebook Video publish failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to publish video to Facebook.');
    }

    return data as FacebookVideoResponse;
  }

  /**
   * Deletes a published post by external Post ID.
   */
  async deletePost(postId: string, pageAccessToken: string): Promise<boolean> {
    const url = `${this.getGraphApiUrl()}/${postId}?access_token=${pageAccessToken}`;

    const response = await fetch(url, { method: 'DELETE' });
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new BadRequestException(data.error?.message || `Failed to delete post ${postId}`);
    }

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

    let url = `${this.getGraphApiUrl()}/${pageId}/insights?metric=${metrics}&access_token=${pageAccessToken}`;
    if (since) url += `&since=${since}`;
    if (until) url += `&until=${until}`;

    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.warn(`Failed to fetch Facebook Page insights: ${JSON.stringify(data.error || data)}`);
      return { data: [] };
    }

    return data as FacebookInsightsResponse;
  }
}
