import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from './jwt/jwt.service';
import JSendSerializer from 'r-jsend';
import { User, UserSchema } from '../schemas/user.schema';
import { Chat, ChatSchema } from '../schemas/chat.schema';
import { Message, MessageSchema } from '../schemas/message.schema';
import { AppGateway } from './app.gateway';
import { ChatsModule } from './chats/chats.module';
import { AppService } from './app.service';
import { WSService } from './chats/WS.service';
import { UsersModule } from './users/users.module';
import { ChatsMessagesModule } from './chats/chats-messages/chats-messages.module';
import { ChatsUsersModule } from './chats/chats-users/chats-users.module';

const models = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Chat.name, schema: ChatSchema },
  { name: Message.name, schema: MessageSchema },
]);

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kp11-messenger'),
    models,
    ChatsModule,
    UsersModule,
    ChatsMessagesModule,
    ChatsUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, JSendSerializer, JwtService, AppGateway, WSService],
  exports: [models, WSService, JSendSerializer, JwtService, UsersModule],
})
export class AppModule {}
