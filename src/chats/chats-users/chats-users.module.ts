import { Module } from '@nestjs/common';
import { ChatsUsersController } from './chats-users.controller';
import { ChatsUsersService } from './chats-users.service';
import { ChatsMessagesModule } from '../chats-messages/chats-messages.module';
import ChatsUsersEvents from './chats-users.events';
import { UsersModule } from '../../users/users.module';
import { ChatsModule } from '../chats.module';

@Module({
  controllers: [ChatsUsersController],
  providers: [ChatsUsersService, ChatsUsersEvents],
  imports: [ChatsMessagesModule, UsersModule, ChatsModule],
})
export class ChatsUsersModule {}
