import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../common/enums/role.enum';

export type TempUserDocument = TempUser & Document;

@Schema({ timestamps: true })
export class TempUser {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];

  @Prop()
  country?: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true, unique: true, index: true })
  verificationToken: string;

  @Prop({ required: true, expires: 0 })
  expiresAt: Date;
}

export const TempUserSchema = SchemaFactory.createForClass(TempUser);
