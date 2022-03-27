import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatsService } from '../chats.service';
import { exclude, IsObjectId } from '../../../utils/object';
import { isArray } from 'util';
import { Subject } from '../../../utils/Observer';
import ChatsUsersEvents from './chats-users.events';

@Injectable()
export class ChatsUsersService extends Subject {
  public constructor(
    private chatsService: ChatsService,
    private chatsUsersEvents: ChatsUsersEvents,
  ) {
    super();
    this.subscribe(this.chatsUsersEvents);
  }

  public onUserAdd(chatId: string, senderId: string, userId: string) {
    this.notify('userAdd', chatId, senderId, userId);
  }

  public async onUserRemove(chatId: string, senderId: string, userId: string) {
    await this.notify('userRemove', chatId, senderId, userId);
  }

  public async addUsers(
    chatId: string,
    senderId: string,
    users: Array<string>,
  ) {
    const MAX_MEMBERS_COUNT = 100;

    if (!users || !isArray(users)) {
      throw new BadRequestException('Неверные параметры запроса');
    }

    const chat = await this.chatsService.getChat(chatId);

    for (const userId of users) {
      if (chat.users.length < MAX_MEMBERS_COUNT) {
        IsObjectId(userId);

        if (this.chatsService.isUserInChat(chat, userId)) {
          throw new BadRequestException('Пользователь уже состоит в этом чате');
        }

        chat.users.push(userId as any);
        await chat.save();

        this.onUserAdd(chatId, senderId, userId);
      } else {
        throw new BadRequestException(
          `Макисмальное число участников в чате - ${MAX_MEMBERS_COUNT}`,
        );
      }
    }

    const result = await chat.populate({
      path: 'users',
      select: this.chatsService.populateArray,
    });

    return exclude(result.toObject(), ['__v']);
  }

  public async removeUser(chatId: string, senderId: string, userId: string) {
    IsObjectId(userId);

    if (senderId == userId) {
      throw new BadRequestException('Вы не можете удалить самого себя из чата');
    }

    const chat = await this.chatsService.getChat(chatId);

    this.chatsService.isUserCreatorException(chat, senderId);

    const index = chat.users.findIndex((elem) => {
      return (elem as any)._id.toString() === userId.toString();
    });

    if (index === -1) {
      throw new NotFoundException('Этот пользователь не состоит в чате');
    }

    chat.users = chat.users.filter((elem, i) => i !== index);
    await this.onUserRemove(chatId, senderId, userId);
    await chat.save();

    return exclude(chat.toObject(), ['__v']);
  }
}
