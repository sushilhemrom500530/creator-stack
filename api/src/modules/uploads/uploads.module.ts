import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { Media, MediaSchema } from './schemas/media.schema';
import { Workspace, WorkspaceSchema } from '../workspaces/schemas/workspace.schema';
import { CloudinaryStorageProvider } from './storage/cloudinary.storage';
import { S3StorageProvider } from './storage/s3.storage';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Media.name, schema: MediaSchema },
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
  ],
  controllers: [UploadsController],
  providers: [UploadsService, CloudinaryStorageProvider, S3StorageProvider],
  exports: [UploadsService, CloudinaryStorageProvider, S3StorageProvider],
})
export class UploadsModule {}
