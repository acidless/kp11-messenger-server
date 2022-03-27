import { Module } from '@nestjs/common';
import { ChatsMessagesController } from './chats-messages.controller';
import { ChatsMessagesService } from './chats-messages.service';
import { ChatsModule } from '../chats.module';

@Module({
  controllers: [ChatsMessagesController],
  providers: [ChatsMessagesService],
  exports: [ChatsMessagesService],
  imports: [ChatsModule],
})
export class ChatsMessagesModule {}
