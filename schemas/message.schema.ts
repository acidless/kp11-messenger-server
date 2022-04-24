import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDocument } from './user.schema';
import { ChatDocument } from './chat.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  public sender: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  })
  public chat: ChatDocument;

  @Prop({ maxlength: 2048 })
  public content: string;

  @Prop({ type: Date })
  public sendAt: Date;

  @Prop({ type: Boolean })
  public isSystem: boolean;

  @Prop({ type: [String] })
  public attachments: Array<string>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
