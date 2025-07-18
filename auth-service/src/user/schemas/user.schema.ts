import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../types/role.type';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({ collection: 'admin_users', timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: false })
  lastName?: string;
  
  @Prop({ required: true })
  avatar!: string;

  @Prop({ type: [String], default: ['user'] })
  role!: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);