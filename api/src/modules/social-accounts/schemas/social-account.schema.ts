import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SocialAccountDocument = SocialAccount & Document;

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  THREADS = 'threads',
  LINKEDIN = 'linkedin',
  X = 'x',
  TIKTOK = 'tiktok',
  PINTEREST = 'pinterest',
  YOUTUBE = 'youtube',
}

export enum SocialAccountStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

@Schema({ timestamps: true })
export class SocialAccount {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true, index: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: String, enum: SocialPlatform, required: true })
  platform: SocialPlatform;

  @Prop({ required: true })
  platformAccountId: string; // Page ID, IG User ID, Threads User ID, LinkedIn URN

  @Prop({ required: true, trim: true })
  accountName: string;

  @Prop({ trim: true })
  username?: string;

  @Prop()
  profilePictureUrl?: string;

  @Prop({ required: true })
  accessTokenEncrypted: string; // AES-256-GCM encrypted

  @Prop()
  refreshTokenEncrypted?: string;

  @Prop({ type: Date, default: null })
  tokenExpiresAt?: Date | null;

  @Prop({ type: [String], default: [] })
  scopes: string[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ type: String, enum: SocialAccountStatus, default: SocialAccountStatus.ACTIVE })
  status: SocialAccountStatus;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export const SocialAccountSchema = SchemaFactory.createForClass(SocialAccount);

SocialAccountSchema.index({ workspaceId: 1, platform: 1, isDeleted: 1 });
SocialAccountSchema.index({ userId: 1, platform: 1, isDeleted: 1 });
SocialAccountSchema.index({ platformAccountId: 1, workspaceId: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
