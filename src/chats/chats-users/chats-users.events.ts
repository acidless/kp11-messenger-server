import { WSService } from '../WS.service';
import { UsersService } from '../../users/users.service';
import { ChatsMessagesService } from '../chats-messages/chats-messages.service';
import { Subscriber } from '../../../utils/Observer';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class ChatsUsersEvents implements Subscriber {
  public constructor(
    private wsService: WSService,
    private usersService: UsersService,
    private chatMessagesService: ChatsMessagesService,
  ) {}

  public async onEvent(event: string, chatId: string, senderId: string, userId: string) {
    switch (event) {
      case 'userAdd': {
        const user = await this.usersService.getById(userId);
        const message = await this.chatMessagesService.sendMessage(
          senderId.toString(),
          chatId,
          `Пригласил(-а) пользователя ${user.name + ' ' + user.surname}`,
          true,
        );
        return await this.wsService.sendMessage({ ...message, action: 'userAdd', target: userId });
      }
      case 'userRemove': {
        const user = await this.usersService.getById(userId);
        const message = await this.chatMessagesService.sendMessage(
          senderId.toString(),
          chatId,
          `Удалил(-а) пользователя ${user.name + ' ' + user.surname}`,
          true,
        );

        return await this.wsService.sendMessage({
          ...message,
          action: 'userRemove',
          target: userId,
        });
      }
      case 'userLeave': {
        const message = await this.chatMessagesService.sendMessage(
          senderId.toString(),
          chatId,
          `Покинул(-а) чат`,
          true,
        );

        return await this.wsService.sendMessage({
          ...message,
          target: senderId,
          action: 'userLeave',
        });
      }
      case 'chatRemove': {
        const message = await this.chatMessagesService.sendMessage(senderId.toString(), chatId, `Удалил(-а) чат`, true);

        return await this.wsService.sendMessage({
          ...message,
          target: senderId,
          action: 'chatRemove',
        });
      }
    }
  }
}
