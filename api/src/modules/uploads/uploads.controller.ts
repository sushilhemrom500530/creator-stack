import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiQuery, ApiBody } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Media & Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /**
   * Fast upload to Cloudinary CDN (optimized f_auto,q_auto)
   */
  @Post('cloudinary')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'High-speed media upload to Cloudinary CDN with automatic optimizations' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        workspaceId: { type: 'string' },
        folder: { type: 'string', default: 'creator-stack' },
      },
    },
  })
  uploadCloudinary(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('userId') userId: string,
    @Body('workspaceId') workspaceId: string,
    @Body('folder') folder?: string,
  ) {
    return this.uploadsService.uploadFile(file, workspaceId, userId, 'cloudinary', folder);
  }

  /**
   * Fast upload to AWS S3
   */
  @Post('s3')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'High-speed media upload to AWS S3' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        workspaceId: { type: 'string' },
        folder: { type: 'string', default: 'creator-stack' },
      },
    },
  })
  uploadS3(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('userId') userId: string,
    @Body('workspaceId') workspaceId: string,
    @Body('folder') folder?: string,
  ) {
    return this.uploadsService.uploadFile(file, workspaceId, userId, 's3', folder);
  }

  /**
   * Batch multiple file uploads (up to 10 files simultaneously)
   */
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'High-speed batch file upload (up to 10 files)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        workspaceId: { type: 'string' },
        provider: { type: 'string', enum: ['cloudinary', 's3'], default: 'cloudinary' },
        folder: { type: 'string', default: 'creator-stack' },
      },
    },
  })
  uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser('userId') userId: string,
    @Body('workspaceId') workspaceId: string,
    @Body('provider') provider?: 'cloudinary' | 's3',
    @Body('folder') folder?: string,
  ) {
    return this.uploadsService.uploadMultipleFiles(files, workspaceId, userId, provider || 'cloudinary', folder);
  }

  /**
   * General upload endpoint with provider selector
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload media with optional provider selector' })
  uploadGeneral(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('userId') userId: string,
    @Body('workspaceId') workspaceId: string,
    @Body('provider') provider?: 'cloudinary' | 's3',
    @Body('folder') folder?: string,
  ) {
    return this.uploadsService.uploadFile(file, workspaceId, userId, provider || 'cloudinary', folder);
  }

  /**
   * Retrieve workspace media gallery
   */
  @Get('gallery')
  @ApiOperation({ summary: 'Get workspace media gallery with filters and pagination' })
  @ApiQuery({ name: 'workspaceId', required: true })
  @ApiQuery({ name: 'resourceType', required: false, enum: ['all', 'image', 'video', 'raw'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getGallery(
    @CurrentUser('userId') userId: string,
    @Query('workspaceId') workspaceId: string,
    @Query('resourceType') resourceType?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.uploadsService.findAll(workspaceId, userId, { resourceType, search, page: page ? Number(page) : 1, limit: limit ? Number(limit) : 30 });
  }

  /**
   * Delete media asset
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a media asset' })
  deleteMedia(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.uploadsService.deleteMedia(id, userId);
  }
}
