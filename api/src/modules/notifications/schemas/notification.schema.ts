import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', index: true })
  workspaceId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({
    type: String,
    enum: ['success', 'error', 'warning', 'info'],
    default: 'info',
  })
  type: 'success' | 'error' | 'warning' | 'info';

  @Prop({
    type: String,
    enum: ['publishing', 'token_expiry', 'ai', 'security', 'billing', 'system', 'inbox', 'engagement'],
    default: 'system',
  })
  category: 'publishing' | 'token_expiry' | 'ai' | 'security' | 'billing' | 'system' | 'inbox' | 'engagement';

  @Prop({ trim: true })
  link?: string;

  @Prop({ default: false, index: true })
  read: boolean;

  @Prop({ default: false })
  emailSent: boolean;

  /** Groups repeated events (e.g. several Messenger messages from one person) into one unread notification. */
  @Prop({ type: String, default: null })
  groupKey?: string | null;

  @Prop({ default: 1 })
  groupCount: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, groupKey: 1, read: 1 }, { partialFilterExpression: { groupKey: { $type: 'string' } } });
