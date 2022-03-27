import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User, UserDocument } from './user.schema';
import { MessageDocument } from './message.schema';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: { updatedAt: true } })
export class Chat {
  @Prop({ maxlength: '32', minlength: '3' })
  public name: string;

  @Prop()
  public avatar: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  public users: Array<UserDocument>;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  public creator: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  })
  public lastMessage: MessageDocument;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
