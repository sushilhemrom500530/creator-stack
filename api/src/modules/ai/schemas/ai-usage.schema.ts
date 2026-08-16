import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AiUsageDocument = AiUsage & Document;

@Schema({ timestamps: true })
export class AiUsage {
  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true, index: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['caption', 'hashtags', 'hooks', 'thread', 'chat', 'refine'],
    required: true,
  })
  feature: 'caption' | 'hashtags' | 'hooks' | 'thread' | 'chat' | 'refine';

  @Prop({ required: true, trim: true })
  prompt: string;

  @Prop({ required: true })
  response: string;

  @Prop({ default: 0 })
  promptTokens: number;

  @Prop({ default: 0 })
  completionTokens: number;

  @Prop({ default: 0 })
  totalTokens: number;

  @Prop({ default: 'gemini-1.5-flash' })
  aiModel: string;

  @Prop({ default: 'gemini' })
  provider: 'openai' | 'gemini' | 'mock';
}

export const AiUsageSchema = SchemaFactory.createForClass(AiUsage);

AiUsageSchema.index({ workspaceId: 1, createdAt: -1 });
AiUsageSchema.index({ workspaceId: 1, feature: 1 });
