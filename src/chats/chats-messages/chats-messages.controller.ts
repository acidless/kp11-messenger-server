import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RequestContext } from '../../../decorators/request-context.decorator';
import { Data } from '../../../decorators/data.decorator';
import { CreateMessageDTO } from './MessageDTO';
import JSendSerializer from 'r-jsend';
import { ChatsMessagesService } from './chats-messages.service';

const messageData = ['content'];

@Controller('chats/:id/messages')
export class ChatsMessagesController {
  public constructor(
    private jsendSerializer: JSendSerializer,
    private chatMessagesService: ChatsMessagesService,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  public async sendMessage(
    @RequestContext() ctx,
    @Param('id') chatId,
    @Data(messageData) data: CreateMessageDTO,
  ) {
    const message = await this.chatMessagesService.sendMessage(
      ctx.user._id,
      chatId,
      data.content,
    );

    return this.jsendSerializer.successResponse({ ...message }).get();
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async getMessages(
    @RequestContext() ctx,
    @Param('id') chatId,
    @Query() query,
  ) {
    const messages = await this.chatMessagesService.getMessages(
      ctx.user._id,
      chatId,
      query['p'],
    );

    return this.jsendSerializer.successResponse({ messages }).get();
  }
}
