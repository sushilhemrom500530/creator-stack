import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role, Status } from 'src/common';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  @Prop()
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop({ type: Date, default: null })
  lastLoginAt?: Date;

  @Prop({
    type: [
      {
        sessionId: { type: String, required: true },
        ip: { type: String },
        userAgent: { type: String },
        browser: { type: String },
        os: { type: String },
        device: { type: String },
        createdAt: { type: Date, default: Date.now },
        lastActiveAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  sessions?: Array<{
    sessionId: string;
    ip?: string;
    userAgent?: string;
    browser?: string;
    os?: string;
    device?: string;
    createdAt?: Date;
    lastActiveAt?: Date;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Database indexes for production performance
UserSchema.index({ isDeleted: 1, createdAt: -1 });
UserSchema.index({ isDeleted: 1, status: 1 });
