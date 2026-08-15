import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import {
  ThreadsUser,
  ThreadsContainerResponse,
  ThreadsContainerStatus,
  ThreadsPublishResponse,
  ThreadsInsightsResponse,
} from './threads.types';

@Injectable()
export class ThreadsClient {
  private readonly logger = new Logger(ThreadsClient.name);
  private readonly baseUrl = 'https://graph.threads.net/v1.0';

  /**
   * Fetches the authenticated Threads user profile.
   */
  async getUserProfile(accessToken: string): Promise<ThreadsUser> {
    const fields = 'id,username,name,threads_profile_picture_url,threads_biography';
    const url = `${this.baseUrl}/me?fields=${fields}&access_token=${accessToken}`;

    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Threads getUserProfile failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to fetch Threads profile.');
    }

    return data as ThreadsUser;
  }

  /**
   * Step 1 (Text / Link): Create a Text Threads Media Container.
   */
  async createTextContainer(
    threadsUserId: string,
    accessToken: string,
    text: string,
    linkAttachment?: string,
  ): Promise<ThreadsContainerResponse> {
    const url = `${this.baseUrl}/${threadsUserId}/threads`;
    const params = new URLSearchParams({
      media_type: 'TEXT',
      text,
      access_token: accessToken,
    });

    if (linkAttachment) {
      params.append('link_attachment', linkAttachment);
    }

    const response = await fetch(`${url}?${params.toString()}`, { method: 'POST' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Threads Text Container creation failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to create Threads text container.');
    }

    return data as ThreadsContainerResponse;
  }

  /**
   * Step 1 (Image): Create an Image Threads Media Container.
   */
  async createImageContainer(
    threadsUserId: string,
    accessToken: string,
    imageUrl: string,
    text?: string,
  ): Promise<ThreadsContainerResponse> {
    const url = `${this.baseUrl}/${threadsUserId}/threads`;
    const params = new URLSearchParams({
      media_type: 'IMAGE',
      image_url: imageUrl,
      access_token: accessToken,
    });

    if (text) params.append('text', text);

    const response = await fetch(`${url}?${params.toString()}`, { method: 'POST' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Threads Image Container creation failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to create Threads image container.');
    }

    return data as ThreadsContainerResponse;
  }

  /**
   * Step 1 (Video): Create a Video Threads Media Container.
   */
  async createVideoContainer(
    threadsUserId: string,
    accessToken: string,
    videoUrl: string,
    text?: string,
  ): Promise<ThreadsContainerResponse> {
    const url = `${this.baseUrl}/${threadsUserId}/threads`;
    const params = new URLSearchParams({
      media_type: 'VIDEO',
      video_url: videoUrl,
      access_token: accessToken,
    });

    if (text) params.append('text', text);

    const response = await fetch(`${url}?${params.toString()}`, { method: 'POST' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Threads Video Container creation failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to create Threads video container.');
    }

    return data as ThreadsContainerResponse;
  }

  /**
   * Step 2: Poll container status until FINISHED or ERROR.
   */
  async pollContainerStatus(
    containerId: string,
    accessToken: string,
    maxAttempts = 10,
    delayMs = 3000,
  ): Promise<boolean> {
    const url = `${this.baseUrl}/${containerId}?fields=id,status,error_message&access_token=${accessToken}`;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await fetch(url, { method: 'GET' });
      const data: ThreadsContainerStatus = await response.json();

      if ((data as any).error) {
        throw new BadRequestException((data as any).error?.message || 'Error checking Threads container status.');
      }

      if (data.status === 'FINISHED') {
        return true;
      }

      if (data.status === 'ERROR' || data.status === 'EXPIRED') {
        throw new BadRequestException(`Threads media processing failed: ${data.error_message || data.status}`);
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new BadRequestException('Threads media container processing timed out.');
  }

  /**
   * Step 3: Publish the ready Media Container.
   */
  async publishContainer(
    threadsUserId: string,
    accessToken: string,
    creationId: string,
  ): Promise<ThreadsPublishResponse> {
    const url = `${this.baseUrl}/${threadsUserId}/threads_publish`;
    const params = new URLSearchParams({
      creation_id: creationId,
      access_token: accessToken,
    });

    const response = await fetch(`${url}?${params.toString()}`, { method: 'POST' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Threads Publish execution failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to publish Thread.');
    }

    return data as ThreadsPublishResponse;
  }

  /**
   * Fetches Threads Account Insights & Metrics.
   */
  async getUserInsights(
    threadsUserId: string,
    accessToken: string,
    since?: number,
    until?: number,
  ): Promise<ThreadsInsightsResponse> {
    const metrics = 'views,likes,replies,reposts,quotes';
    let url = `${this.baseUrl}/${threadsUserId}/threads_insights?metric=${metrics}&access_token=${accessToken}`;

    if (since) url += `&since=${since}`;
    if (until) url += `&until=${until}`;

    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.warn(`Failed to fetch Threads insights: ${JSON.stringify(data.error || data)}`);
      return { data: [] };
    }

    return data as ThreadsInsightsResponse;
  }
}
