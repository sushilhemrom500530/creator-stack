import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SocialPlatform } from '../../social-accounts/schemas/social-account.schema';

export type ConversationDocument = Conversation & Document;

export enum MessageDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

/**
 * A private message thread between a connected account (e.g. a Facebook Page)
 * and one external person (identified by their page-scoped id, PSID).
 */
@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true, index: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SocialAccount', required: true, index: true })
  socialAccountId: Types.ObjectId;

  @Prop({ type: String, enum: SocialPlatform, required: true })
  platform: SocialPlatform;

  /** Page-scoped id of the person the Page is talking to. */
  @Prop({ required: true })
  participantId: string;

  @Prop({ type: String, trim: true, default: null })
  participantName?: string | null;

  @Prop({ type: String, default: null })
  participantAvatarUrl?: string | null;

  /** Graph conversation id (t_...), when known from a sync. */
  @Prop({ type: String, default: null })
  platformConversationId?: string | null;

  @Prop({ default: '' })
  lastMessageText: string;

  @Prop({ type: Date, default: null, index: true })
  lastMessageAt?: Date | null;

  @Prop({ type: String, enum: MessageDirection, default: MessageDirection.INBOUND })
  lastMessageDirection: MessageDirection;

  /** Last time the person wrote to us — drives Messenger's 24-hour reply window. */
  @Prop({ type: Date, default: null })
  lastInboundAt?: Date | null;

  @Prop({ default: 0 })
  unreadCount: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index({ socialAccountId: 1, participantId: 1 }, { unique: true });
ConversationSchema.index({ workspaceId: 1, lastMessageAt: -1 });
