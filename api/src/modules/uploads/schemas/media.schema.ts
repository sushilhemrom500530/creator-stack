import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema({ timestamps: true })
export class Media {
  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true, index: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['cloudinary', 's3', 'local'], default: 'cloudinary' })
  provider: 'cloudinary' | 's3' | 'local';

  @Prop({ required: true, trim: true })
  publicId: string;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop({ required: true, trim: true })
  secureUrl: string;

  @Prop({ trim: true })
  thumbnailUrl?: string;

  @Prop({ required: true, trim: true })
  fileName: string;

  @Prop({ required: true, trim: true })
  originalName: string;

  @Prop({ required: true, trim: true })
  mimeType: string;

  @Prop({ type: String, enum: ['image', 'video', 'raw'], default: 'image' })
  resourceType: 'image' | 'video' | 'raw';

  @Prop({ required: true })
  size: number;

  @Prop()
  width?: number;

  @Prop()
  height?: number;

  @Prop()
  duration?: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.index({ workspaceId: 1, resourceType: 1, isDeleted: 1 });
MediaSchema.index({ workspaceId: 1, createdAt: -1, isDeleted: 1 });
