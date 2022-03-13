import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../../schemas/chat.schema';

@Injectable()
export class ChatsService {
  public constructor(
    @InjectModel(Chat.name) private model: Model<ChatDocument>,
  ) {}

  public async createChat(name: string, userId: string) {
    return this.model.create({ name, users: [userId] });
  }

  public async getChats(name: string, page: number, userId: string) {
    const PER_PAGE = 40;

    let findObject: any = {
      users: userId,
    };

    if (name) {
      findObject = {
        name: { $regex: name, $options: 'i' },
        users: userId,
      };
    }

    const query = this.model.find(findObject);
    const result: any = {};

    const data = await query
      .clone()
      .skip(page * PER_PAGE)
      .limit(PER_PAGE);

    result.count = await query.count();
    result.chats = data;

    return result;
  }
}
