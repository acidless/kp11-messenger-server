import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDocument } from './user.schema';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ maxlength: '32', minlength: '3' })
  public name: string;

  @Prop()
  public avatarUrl: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  public users: Array<UserDocument>;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
