import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatsModifyService } from './chats-modify.service';
import ChatsEvents from './chats.events';
import { ChatsMessagesService } from './chats-messages/chats-messages.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, ChatsModifyService, ChatsMessagesService, ChatsEvents],
  exports: [ChatsService],
})
export class ChatsModule {}
