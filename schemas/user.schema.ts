import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ maxlength: '32', minlength: '3' })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ maxlength: '64' })
  name: string;

  @Prop({ maxlength: '128' })
  surname: string;

  @Prop({ length: '11' })
  phoneNumber: string;

  @Prop({ maxlength: 32 })
  group: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
