import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SocialPlatform } from 'src/modules/social-accounts/schemas/social-account.schema';

export type PostDocument = Post & Document;

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHING = 'publishing',
  PUBLISHED = 'published',
  PARTIALLY_PUBLISHED = 'partially_published',
  FAILED = 'failed',
  ARCHIVED = 'archived',
}

export enum PostTargetStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PUBLISHED = 'published',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Schema({ _id: false, timestamps: false })
export class PostTarget {
  @Prop({ type: Types.ObjectId, ref: 'SocialAccount', required: true, index: true })
  accountId: Types.ObjectId;

  @Prop({ type: String, enum: SocialPlatform, required: true })
  platform: SocialPlatform;

  @Prop({ trim: true })
  platformContent?: string; // Optional platform-specific override

  @Prop({ type: [String], default: [] })
  mediaOverrides?: string[];

  @Prop({ type: Object, default: {} })
  options?: Record<string, any>; // e.g. { isReel: true, title: 'My Video', linkUrl: 'https://...' }

  @Prop({ type: String, enum: PostTargetStatus, default: PostTargetStatus.PENDING })
  status: PostTargetStatus;

  @Prop()
  externalPostId?: string;

  @Prop()
  externalPostUrl?: string;

  @Prop()
  errorMessage?: string;

  @Prop({ type: Date, default: null })
  publishedAt?: Date | null;

  @Prop({ default: 0 })
  retryCount: number;

  @Prop({ type: Date, default: null })
  lastRetryAt?: Date | null;
}

export const PostTargetSchema = SchemaFactory.createForClass(PostTarget);

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true, index: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  baseContent: string;

  @Prop({ type: [String], default: [] })
  mediaUrls: string[];

  @Prop({ type: [PostTargetSchema], default: [] })
  targets: PostTarget[];

  @Prop({ type: String, enum: PostStatus, default: PostStatus.DRAFT, index: true })
  status: PostStatus;

  @Prop({ type: Date, default: null, index: true })
  scheduledAt?: Date | null;

  @Prop({ type: Date, default: null })
  publishedAt?: Date | null;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;

  @Prop({ default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ workspaceId: 1, status: 1, isDeleted: 1 });
PostSchema.index({ workspaceId: 1, scheduledAt: 1, isDeleted: 1 });
PostSchema.index({ workspaceId: 1, createdAt: -1, isDeleted: 1 });
PostSchema.index({ 'targets.accountId': 1, isDeleted: 1 });
