import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../../../schemas/message.schema';
import { ChatsService } from '../chats.service';
import { exclude, IsObjectId } from '../../../utils/object';

@Injectable()
export class ChatsMessagesService {
  public constructor(
    @InjectModel(Message.name) private model: Model<MessageDocument>,
    private chatsService: ChatsService,
  ) {}

  public async sendMessage(
    senderId: string,
    chatId: string,
    content: string,
    isSystem = false,
    files: Array<Express.Multer.File> = [],
  ) {
    IsObjectId(chatId);

    const filePathes = files.map((file) => {
      return file.path;
    });

    const chat = await this.chatsService.getChat(chatId);
    this.chatsService.isUserInChat(chat, senderId);

    const message = await this.model.create({
      sender: senderId,
      chat: chatId,
      content,
      isSystem: isSystem ? true : undefined,
      sendAt: Date.now(),
      attachments: filePathes,
    });

    chat.lastMessage = message._id as any;
    await chat.save();

    return exclude(message.toObject(), ['__v']);
  }

  public async getMessages(senderId: string, chatId: string, page: number) {
    const PER_PAGE = 50;

    IsObjectId(chatId);

    const chat = await this.chatsService.getChat(chatId);
    this.chatsService.isUserInChat(chat, senderId);

    const messages = await this.model
      .find({ chat: chatId })
      .sort('-sendAt')
      .skip(PER_PAGE * page)
      .limit(PER_PAGE)
      .populate('sender', this.chatsService.populateArray)
      .select('-__v');

    return { messages, isLastPage: messages.length === 0 };
  }
}
