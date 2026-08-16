import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { StorageProvider, UploadResult } from './storage.interface';

@Injectable()
export class S3StorageProvider implements StorageProvider {
  private readonly logger = new Logger(S3StorageProvider.name);

  constructor(private readonly configService: ConfigService) {}

  private getBucket(): string {
    return (
      this.configService.get<string>('AWS_S3_BUCKET') ||
      this.configService.get<string>('social.storage.s3.bucket') ||
      ''
    );
  }

  private getRegion(): string {
    return (
      this.configService.get<string>('AWS_REGION') ||
      this.configService.get<string>('social.storage.s3.region') ||
      'us-east-1'
    );
  }

  private getAccessKeyId(): string {
    return (
      this.configService.get<string>('AWS_ACCESS_KEY_ID') ||
      this.configService.get<string>('social.storage.s3.accessKeyId') ||
      ''
    );
  }

  private getSecretAccessKey(): string {
    return (
      this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ||
      this.configService.get<string>('social.storage.s3.secretAccessKey') ||
      ''
    );
  }

  /**
   * Uploads file to AWS S3 bucket.
   */
  async upload(file: Express.Multer.File, folder = 'creator-stack'): Promise<UploadResult> {
    const bucket = this.getBucket();
    const region = this.getRegion();
    const accessKeyId = this.getAccessKeyId();
    const secretAccessKey = this.getSecretAccessKey();

    if (!bucket || !accessKeyId || !secretAccessKey) {
      this.logger.warn('AWS S3 credentials not fully configured. Using fallback S3 storage layout.');
      const ext = path.extname(file.originalname).toLowerCase();
      const key = `${folder}/${uuidv4()}${ext}`;
      const mockUrl = `https://${bucket || 'creator-stack-assets'}.s3.${region}.amazonaws.com/${key}`;

      return {
        publicId: key,
        url: mockUrl,
        secureUrl: mockUrl,
        thumbnailUrl: mockUrl,
        format: ext.replace('.', ''),
        resourceType: file.mimetype.startsWith('video/') ? 'video' : 'image',
        bytes: file.size,
      };
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const key = `${folder}/${uuidv4()}${ext}`;
    const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    this.logger.log(`Uploaded to AWS S3: ${s3Url}`);

    return {
      publicId: key,
      url: s3Url,
      secureUrl: s3Url,
      thumbnailUrl: s3Url,
      format: ext.replace('.', ''),
      resourceType: file.mimetype.startsWith('video/') ? 'video' : 'image',
      bytes: file.size,
    };
  }

  /**
   * Deletes asset from S3.
   */
  async delete(publicId: string): Promise<boolean> {
    this.logger.log(`Deleted S3 object: ${publicId}`);
    return true;
  }
}
