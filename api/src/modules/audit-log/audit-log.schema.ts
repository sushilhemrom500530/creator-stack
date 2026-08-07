import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  action: string; // LOGIN, LOGOUT, CREATE, UPDATE, DELETE, ADMIN_ACTION

  @Prop({ required: true })
  resource: string;

  @Prop()
  details?: string;

  @Prop({ required: true })
  ipAddress: string;

  @Prop()
  userAgent?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
