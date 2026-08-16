import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { StorageProvider, UploadResult } from './storage.interface';

@Injectable()
export class CloudinaryStorageProvider implements StorageProvider {
  private readonly logger = new Logger(CloudinaryStorageProvider.name);

  constructor(private readonly configService: ConfigService) {}

  private getCloudName(): string {
    return (
      this.configService.get<string>('CLOUDINARY_NAME') ||
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
      this.configService.get<string>('social.storage.cloudinary.cloudName') ||
      'tf3tr3p5'
    );
  }

  private getApiKey(): string {
    return (
      this.configService.get<string>('CLOUDINARY_API_KEY') ||
      this.configService.get<string>('social.storage.cloudinary.apiKey') ||
      ''
    ).trim();
  }

  private getApiSecret(): string {
    return (
      this.configService.get<string>('CLOUDINARY_API_SECRET') ||
      this.configService.get<string>('social.storage.cloudinary.apiSecret') ||
      ''
    ).trim();
  }

  /**
   * Generates a signed Cloudinary SHA-1 signature.
   */
  private generateSignature(params: Record<string, any>, apiSecret: string): string {
    const sortedKeys = Object.keys(params).sort();
    const serialized = sortedKeys
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    return crypto.createHash('sha1').update(`${serialized}${apiSecret}`).digest('hex');
  }

  /**
   * Uploads file buffer directly to Cloudinary REST API.
   */
  async upload(file: Express.Multer.File, folder = 'creator-stack'): Promise<UploadResult> {
    const cloudName = this.getCloudName();
    const apiKey = this.getApiKey();
    const apiSecret = this.getApiSecret();

    if (!cloudName || !apiKey || !apiSecret) {
      throw new BadRequestException('Cloudinary configuration is incomplete in server environment.');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const isVideo = file.mimetype.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    const signParams: Record<string, any> = {
      folder,
      timestamp,
    };

    const signature = this.generateSignature(signParams, apiSecret);

    // Build multipart/form-data payload
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
    formData.append('file', blob, file.originalname);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    formData.append('signature', signature);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      this.logger.error(`Cloudinary upload failed: ${JSON.stringify(data.error || data)}`);
      throw new BadRequestException(data.error?.message || 'Failed to upload media to Cloudinary.');
    }

    const publicId = data.public_id;
    // URL with automatic format and quality optimizations (f_auto,q_auto)
    const optimizedUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/f_auto,q_auto/${publicId}`;
    const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/c_fill,w_400,h_400,g_auto,f_auto,q_auto/${publicId}`;

    this.logger.log(`Successfully uploaded to Cloudinary: ${optimizedUrl}`);

    return {
      publicId,
      url: optimizedUrl,
      secureUrl: optimizedUrl,
      thumbnailUrl,
      format: data.format || (isVideo ? 'mp4' : 'jpg'),
      resourceType: (data.resource_type || resourceType) as 'image' | 'video' | 'raw',
      bytes: data.bytes || file.size,
      width: data.width,
      height: data.height,
      duration: data.duration,
    };
  }

  /**
   * Deletes asset from Cloudinary.
   */
  async delete(publicId: string, resourceType: string = 'image'): Promise<boolean> {
    const cloudName = this.getCloudName();
    const apiKey = this.getApiKey();
    const apiSecret = this.getApiSecret();

    if (!cloudName || !apiKey || !apiSecret) return false;

    const timestamp = Math.floor(Date.now() / 1000);
    const signParams = { public_id: publicId, timestamp };
    const signature = this.generateSignature(signParams, apiSecret);

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const destroyUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`;

    const response = await fetch(destroyUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.result === 'ok';
  }
}
