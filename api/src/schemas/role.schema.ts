import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = RoleSchemaClass & Document;

@Schema({ timestamps: true })
export class RoleSchemaClass {
  @Prop({ required: true, unique: true, uppercase: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleSchemaClass);
