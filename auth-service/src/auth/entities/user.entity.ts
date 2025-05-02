import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
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
  role!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);