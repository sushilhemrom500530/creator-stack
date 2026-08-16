import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Media, MediaDocument } from './schemas/media.schema';
import { CloudinaryStorageProvider } from './storage/cloudinary.storage';
import { S3StorageProvider } from './storage/s3.storage';
import { Workspace, WorkspaceDocument } from '../workspaces/schemas/workspace.schema';

export interface FileValidationOptions {
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly defaultAllowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'application/pdf',
  ];
  private readonly defaultMaxSize = 100 * 1024 * 1024; // 100MB

  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
    @InjectModel(Workspace.name) private readonly workspaceModel: Model<WorkspaceDocument>,
    private readonly cloudinaryStorage: CloudinaryStorageProvider,
    private readonly s3Storage: S3StorageProvider,
  ) {}

  private async verifyWorkspaceAccess(workspaceId: string, userId: string): Promise<WorkspaceDocument> {
    const userObjectId = new Types.ObjectId(userId);
    const workspace = await this.workspaceModel.findOne({
      _id: new Types.ObjectId(workspaceId),
      $or: [{ ownerId: userObjectId }, { 'members.userId': userObjectId }],
      isDeleted: false,
    });

    if (!workspace) {
      throw new ForbiddenException('Workspace access denied.');
    }
    return workspace;
  }

  /**
   * High performance file upload pipeline to Cloudinary or S3.
   */
  async uploadFile(
    file: Express.Multer.File,
    workspaceId: string,
    userId: string,
    provider: 'cloudinary' | 's3' = 'cloudinary',
    folder = 'creator-stack',
    tags: string[] = [],
  ): Promise<MediaDocument> {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    await this.verifyWorkspaceAccess(workspaceId, userId);

    // Validate MIME type
    if (!this.defaultAllowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed types: images, mp4/mov videos, pdfs.`,
      );
    }

    // Validate file size
    if (file.size > this.defaultMaxSize) {
      throw new BadRequestException(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of 100MB.`,
      );
    }

    // Dispatch to requested storage provider
    const storageProvider = provider === 's3' ? this.s3Storage : this.cloudinaryStorage;
    const result = await storageProvider.upload(file, folder);

    // Save metadata in database
    const media = new this.mediaModel({
      workspaceId: new Types.ObjectId(workspaceId),
      userId: new Types.ObjectId(userId),
      provider,
      publicId: result.publicId,
      url: result.url,
      secureUrl: result.secureUrl,
      thumbnailUrl: result.thumbnailUrl || result.secureUrl,
      fileName: result.publicId.split('/').pop() || file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      resourceType: result.resourceType,
      size: result.bytes,
      width: result.width,
      height: result.height,
      duration: result.duration,
      tags,
    });

    const saved = await media.save();
    this.logger.log(`Saved media record [${saved._id}] via ${provider} -> ${result.url}`);
    return saved;
  }

  /**
   * High performance multiple files batch upload pipeline.
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    workspaceId: string,
    userId: string,
    provider: 'cloudinary' | 's3' = 'cloudinary',
    folder = 'creator-stack',
  ): Promise<MediaDocument[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided for batch upload.');
    }

    await this.verifyWorkspaceAccess(workspaceId, userId);

    // Upload all files concurrently in parallel
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, workspaceId, userId, provider, folder),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Retrieves paginated media gallery for the workspace.
   */
  async findAll(
    workspaceId: string,
    userId: string,
    filter: { resourceType?: string; search?: string; page?: number; limit?: number },
  ) {
    await this.verifyWorkspaceAccess(workspaceId, userId);

    const query: Record<string, any> = {
      workspaceId: new Types.ObjectId(workspaceId),
      isDeleted: false,
    };

    if (filter.resourceType && filter.resourceType !== 'all') {
      query.resourceType = filter.resourceType;
    }

    if (filter.search) {
      query.originalName = { $regex: filter.search, $options: 'i' };
    }

    const page = filter.page || 1;
    const limit = filter.limit || 30;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.mediaModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email avatar')
        .exec(),
      this.mediaModel.countDocuments(query),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Deletes media asset from storage provider and soft deletes from database.
   */
  async deleteMedia(id: string, userId: string): Promise<{ message: string }> {
    const media = await this.mediaModel.findOne({ _id: new Types.ObjectId(id), isDeleted: false });
    if (!media) throw new NotFoundException('Media item not found.');

    await this.verifyWorkspaceAccess(media.workspaceId.toString(), userId);

    // Delete from storage provider
    try {
      if (media.provider === 'cloudinary') {
        await this.cloudinaryStorage.delete(media.publicId, media.resourceType);
      } else if (media.provider === 's3') {
        await this.s3Storage.delete(media.publicId);
      }
    } catch (err: any) {
      this.logger.warn(`Storage delete error for [${media.publicId}]: ${err.message}`);
    }

    media.isDeleted = true;
    media.deletedAt = new Date();
    await media.save();

    this.logger.log(`Deleted media record [${id}]`);
    return { message: 'Media deleted successfully.' };
  }
}
