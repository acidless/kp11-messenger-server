import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../../schemas/chat.schema';
import { exclude } from '../../utils/object';
import * as fs from 'fs';
import * as path from 'path';
import { ChatUpdateDTO } from './ChatDTO';
import { ChatsService } from './chats.service';
import ChatsEvents from './chats.events';
import { Subject } from '../../utils/Observer';

@Injectable()
export class ChatsModifyService extends Subject {
  public constructor(
    @InjectModel(Chat.name) private model: Model<ChatDocument>,
    private chatsService: ChatsService,
    private chatsEvents: ChatsEvents,
  ) {
    super();
    this.subscribe(chatsEvents);
  }

  public onChatUpdate(chatId: string, senderId: string) {
    this.notify('chatUpdate', chatId, senderId);
  }

  public onChatCreate(chatId: string, senderId: string) {
    this.notify('chatCreate', chatId, senderId);
  }

  public async createChat(name: string, userId: string, users: Array<string> = []) {
    if (users.find((user) => user == userId)) {
      throw new BadRequestException('Вы не можете создать чат с самим собой');
    }

    const chat = await this.model.create({
      name,
      users: [userId, ...users],
      creator: userId,
    });

    this.onChatCreate(chat._id.toString(), userId);
    return exclude(chat.toObject(), ['__v']);
  }

  public async updateChat(id: string, userId: string, data: ChatUpdateDTO) {
    const chat = await this.chatsService.getChat(id);

    if (data.avatar && chat.avatar) {
      fs.unlink(path.resolve(__dirname, '../../../../', chat.avatar), (err) => {
        console.log(err);
      });
    }

    if (chat.creator.toString() == userId) {
      chat.name = data.name;

      if (data.avatar) {
        chat.avatar = data.avatar;
      }

      await chat.save();
      this.onChatUpdate(id, userId);

      return chat;
    }

    throw new ForbiddenException('Чтобы изменить название чата, вы должны быть создателем');
  }
}
