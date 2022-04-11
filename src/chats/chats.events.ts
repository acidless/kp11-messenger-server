import { Injectable } from '@nestjs/common';
import { WSService } from './WS.service';
import { Subscriber } from '../../utils/Observer';
import { ChatsMessagesService } from './chats-messages/chats-messages.service';

@Injectable()
export default class ChatsEvents implements Subscriber {
  public constructor(private wsService: WSService, private chatMessagesService: ChatsMessagesService) {}

  public async onEvent(event: string, chatId: string, senderId: string) {
    let content;

    if (event === 'chatUpdate') {
      content = `Изменил(-а) данные чата`;
    } else {
      content = `Создал(-а) чат`;
    }

    const message = await this.chatMessagesService.sendMessage(senderId.toString(), chatId, content, true);
    await this.wsService.sendMessage({ ...message, action: 'changeChat' });
  }
}
