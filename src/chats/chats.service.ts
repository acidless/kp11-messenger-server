import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from '../../schemas/chat.schema';
import { IsObjectId } from '../../utils/object';

@Injectable()
export class ChatsService {
  public populateArray = ['_id', 'name', 'surname', 'avatar', 'group'];

  public constructor(@InjectModel(Chat.name) private model: Model<ChatDocument>) {}

  public async getChats(name: string, page: number, userId: string) {
    const PER_PAGE = 40;

    let findObject: any = {
      users: userId,
    };

    if (name) {
      findObject = {
        name: {
          $regex: name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          $options: 'i',
        },
        users: userId,
      };
    }

    const query = this.model.find(findObject).select('name _id avatar creator');
    const result: any = {};

    const data = await query
      .clone()
      .skip(page * PER_PAGE)
      .limit(PER_PAGE)
      .populate({
        path: 'lastMessage',
        select: 'content sendAt sender',
      })
      .sort('-updatedAt name');

    result.count = await query.count();
    result.chats = data;
    result.isLastPage = data.length === 0;

    return result;
  }

  public async getChat(id: string) {
    IsObjectId(id);

    const chat = await this.model.findById(id).populate('users', this.populateArray).select('-__v');

    if (!chat) {
      throw new NotFoundException('Чат с этим ID не найден');
    }

    return chat;
  }

  public isUserInChat(chat: ChatDocument, userId: string) {
    return chat.users.some((user) => (user as any)._id.toString() === userId.toString());
  }

  public isUserInChatException(chat: ChatDocument, userId: string) {
    if (!this.isUserInChat(chat, userId)) {
      throw new BadRequestException('Вы не состоите в этом чате');
    }
  }

  public isUserCreatorException(chat: ChatDocument, userId: string) {
    if ((chat.creator as any)._id.toString() !== userId.toString()) {
      throw new ForbiddenException('Вы должны быть создателем чата для этого');
    }
  }
}
