import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../../schemas/message.schema';

@Injectable()
export class MessagesService {
  public constructor(@InjectModel(Message.name) private model: Model<MessageDocument>) {}

  public async getMessages(userId: string, query: string, page: number) {
    const PER_PAGE = 30;

    if (!query) {
      throw new BadRequestException('Укажите текст сообщения');
    }

    let result = await this.model
      .find({ content: { $regex: query, $options: 'i' } })
      .skip(page * PER_PAGE)
      .limit(PER_PAGE)
      .populate('sender', 'name surname avatar')
      .populate({
        path: 'chat',
        select: 'users',
      })
      .select('-__v');

    const isLastPage = result.length === 0;

    return {
      isLastPage,
      messages: result.filter((message) => {
        if (message.chat) {
          return message.chat.users.some((uId) => uId.toString() === userId.toString());
        }

        return false;
      }),
    };
  }
}
