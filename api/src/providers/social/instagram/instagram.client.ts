import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  InstagramMediaContainerResponse,
  InstagramContainerStatus,
  InstagramPublishResponse,
  InstagramBusinessAccount,
  InstagramInsightsResponse,
} from './instagram.types';

@Injectable()
export class InstagramClient {
  private readonly logger = new Logger(InstagramClient.name);

  constructor(private readonly configService: ConfigService) {}

  private getGraphApiUrl(): string {
    const version = this.configService.get<string>('social.meta.graphVersion') || 'v21.0';
    return `https://graph.facebook.com/${version}`;
  }

  /**
   * Fetches full profile details for an Instagram Business/Creator account.
   */
  async getAccountDetails(igUserId: string, pageAccessToken: string): Promise<InstagramBusinessAccount> {
    const fields = 'id,username,name,profile_picture_url,followers_count,media_count,biography,website';
    const url = `${this.getGraphApiUrl()}/${igUserId}?fields=${fields}&access_token=${pageAccessToken}`;

    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Instagram getAccountDetails failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || `Failed to fetch Instagram profile ${igUserId}`);
    }

    return data as InstagramBusinessAccount;
  }

  /**
   * Step 1: Create an Image Media Container.
   */
  async createImageContainer(
    igUserId: string,
    pageAccessToken: string,
    imageUrl: string,
    caption?: string,
  ): Promise<InstagramMediaContainerResponse> {
    const url = `${this.getGraphApiUrl()}/${igUserId}/media`;
    const params = new URLSearchParams({
      image_url: imageUrl,
      access_token: pageAccessToken,
    });

    if (caption) params.append('caption', caption);

    const response = await fetch(`${url}?${params.toString()}`, { method: 'POST' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Instagram Image Container creation failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to create Instagram image container.');
    }

    return data as InstagramMediaContainerResponse;
  }

  /**
   * Step 1 (Video / Reel): Create a Video Media Container.
   */
  async createVideoContainer(
    igUserId: string,
    pageAccessToken: string,
    videoUrl: string,
    caption?: string,
    isReel: boolean = true,
  ): Promise<InstagramMediaContainerResponse> {
    const url = `${this.getGraphApiUrl()}/${igUserId}/media`;
    const params = new URLSearchParams({
      media_type: isReel ? 'REELS' : 'VIDEO',
      video_url: videoUrl,
      access_token: pageAccessToken,
    });

    if (caption) params.append('caption', caption);

    const response = await fetch(`${url}?${params.toString()}`, { method: 'POST' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Instagram Video Container creation failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to create Instagram video container.');
    }

    return data as InstagramMediaContainerResponse;
  }

  /**
   * Step 2: Poll container status until FINISHED or ERROR.
   */
  async pollContainerStatus(
    containerId: string,
    pageAccessToken: string,
    maxAttempts = 12,
    delayMs = 3000,
  ): Promise<boolean> {
    const url = `${this.getGraphApiUrl()}/${containerId}?fields=status_code,status&access_token=${pageAccessToken}`;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await fetch(url, { method: 'GET' });
      const data: InstagramContainerStatus = await response.json();

      if ((data as any).error) {
        throw new BadRequestException((data as any).error?.message || 'Error checking Instagram container status.');
      }

      if (data.status_code === 'FINISHED') {
        return true;
      }

      if (data.status_code === 'ERROR' || data.status_code === 'EXPIRED') {
        throw new BadRequestException(`Instagram media processing failed with status: ${data.status_code}`);
      }

      // Wait before polling again
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new BadRequestException('Instagram media processing timed out. Please try again.');
  }

  /**
   * Step 3: Publish the ready Media Container.
   */
  async publishContainer(
    igUserId: string,
    pageAccessToken: string,
    creationId: string,
  ): Promise<InstagramPublishResponse> {
    const url = `${this.getGraphApiUrl()}/${igUserId}/media_publish`;
    const params = new URLSearchParams({
      creation_id: creationId,
      access_token: pageAccessToken,
    });

    const response = await fetch(`${url}?${params.toString()}`, { method: 'POST' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Instagram Media Publish failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to publish Instagram media container.');
    }

    return data as InstagramPublishResponse;
  }

  /**
   * Fetches Instagram Account Insights & Metrics.
   */
  async getAccountInsights(
    igUserId: string,
    pageAccessToken: string,
    since?: number,
    until?: number,
  ): Promise<InstagramInsightsResponse> {
    const metrics = 'impressions,reach,profile_views,total_interactions';
    let url = `${this.getGraphApiUrl()}/${igUserId}/insights?metric=${metrics}&metric_type=total_value&period=day&access_token=${pageAccessToken}`;

    if (since) url += `&since=${since}`;
    if (until) url += `&until=${until}`;

    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.warn(`Failed to fetch Instagram insights: ${JSON.stringify(data.error || data)}`);
      return { data: [] };
    }

    return data as InstagramInsightsResponse;
  }
}
