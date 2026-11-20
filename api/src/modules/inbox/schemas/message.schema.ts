import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SocialPlatform } from '../../social-accounts/schemas/social-account.schema';
import { MessageDirection } from './conversation.schema';

export type MessageDocument = Message & Document;

export enum MessageStatus {
  RECEIVED = 'received',
  SENT = 'sent',
  FAILED = 'failed',
}

@Schema({ _id: false })
export class MessageAttachment {
  @Prop({ required: true })
  type: string; // image | video | audio | file | sticker | fallback ...

  @Prop()
  url?: string;

  @Prop()
  name?: string;
}

export const MessageAttachmentSchema = SchemaFactory.createForClass(MessageAttachment);

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true, index: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SocialAccount', required: true })
  socialAccountId: Types.ObjectId;

  @Prop({ type: String, enum: SocialPlatform, required: true })
  platform: SocialPlatform;

  /** Platform message id (Messenger `mid`). Unique, so webhook retries/echoes are de-duplicated. */
  @Prop({ type: String, default: null })
  platformMessageId?: string | null;

  @Prop({ type: String, enum: MessageDirection, required: true })
  direction: MessageDirection;

  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  recipientId: string;

  @Prop({ default: '' })
  text: string;

  @Prop({ type: [MessageAttachmentSchema], default: [] })
  attachments: MessageAttachment[];

  @Prop({ type: String, enum: MessageStatus, default: MessageStatus.RECEIVED })
  status: MessageStatus;

  @Prop({ type: Date, required: true })
  sentAt: Date;

  /** Dashboard user who sent an outbound reply (null for replies sent from Facebook itself). */
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  sentByUserId?: Types.ObjectId | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ conversationId: 1, sentAt: -1 });
MessageSchema.index(
  { platformMessageId: 1 },
  { unique: true, partialFilterExpression: { platformMessageId: { $type: 'string' } } },
);
