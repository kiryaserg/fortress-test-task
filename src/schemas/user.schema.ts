import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  password
}

export const UserSchema = SchemaFactory.createForClass(User);
