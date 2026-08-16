import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnalyticsSnapshotDocument = AnalyticsSnapshot & Document;

@Schema({ timestamps: true })
export class AnalyticsSnapshot {
  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true, index: true })
  workspaceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SocialAccount', index: true })
  accountId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['facebook', 'instagram', 'threads', 'whatsapp', 'x', 'linkedin', 'all'],
    default: 'all',
  })
  platform: string;

  @Prop({ required: true, default: Date.now, index: true })
  date: Date;

  @Prop({ default: 0 })
  impressions: number;

  @Prop({ default: 0 })
  reach: number;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  comments: number;

  @Prop({ default: 0 })
  shares: number;

  @Prop({ default: 0 })
  followers: number;

  @Prop({ default: 0 })
  engagementRate: number;

  @Prop({
    type: {
      positive: { type: Number, default: 72 },
      neutral: { type: Number, default: 21 },
      negative: { type: Number, default: 7 },
      score: { type: Number, default: 8.4 },
    },
    default: { positive: 72, neutral: 21, negative: 7, score: 8.4 },
  })
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
    score: number;
  };
}

export const AnalyticsSnapshotSchema = SchemaFactory.createForClass(AnalyticsSnapshot);

AnalyticsSnapshotSchema.index({ workspaceId: 1, date: -1 });
AnalyticsSnapshotSchema.index({ workspaceId: 1, platform: 1 });
