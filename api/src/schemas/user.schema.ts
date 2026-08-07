import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { Status } from '../common/enums/status.enum';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
