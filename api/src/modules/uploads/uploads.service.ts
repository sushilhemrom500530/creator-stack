import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export interface FileValidationOptions {
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
}

@Injectable()
export class UploadsService {
  private readonly defaultAllowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
  ];
  private readonly defaultMaxSize = 5 * 1024 * 1024; // 5MB

  async processUpload(
    file: { originalname: string; mimetype: string; size: number; buffer: Buffer },
    options: FileValidationOptions = {},
  ) {
    const allowedMimes = options.allowedMimeTypes || this.defaultAllowedMimes;
    const maxSize = options.maxSizeBytes || this.defaultMaxSize;

    // 1. Validate MIME type
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed types: ${allowedMimes.join(', ')}`,
      );
    }

    // 2. Validate Size
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed limit of ${maxSize / (1024 * 1024)}MB`,
      );
    }

    // 3. Rename with UUID & extract clean extension
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueFileName = `${uuidv4()}${ext}`;

    return {
      originalName: file.originalname,
      fileName: uniqueFileName,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${uniqueFileName}`,
      uploadedAt: new Date().toISOString(),
    };
  }
}
