import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { RequestContext } from '../../../decorators/request-context.decorator';
import { CreateMessageDTO } from './MessageDTO';
import JSendSerializer from 'r-jsend';
import { ChatsMessagesService } from './chats-messages.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AllFilesOptions } from '../../../utils/image';

const messageData = ['content'];

@Controller('chats/:id/messages')
export class ChatsMessagesController {
  public constructor(private jsendSerializer: JSendSerializer, private chatMessagesService: ChatsMessagesService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor(AllFilesOptions))
  public async sendMessage(
    @RequestContext() ctx,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') chatId,
    @Body() data: CreateMessageDTO,
  ) {
    const message = await this.chatMessagesService.sendMessage(ctx.user._id, chatId, data.content, false, files);

    return this.jsendSerializer.successResponse({ ...message }).get();
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async getMessages(@RequestContext() ctx, @Param('id') chatId, @Query() query) {
    const result = await this.chatMessagesService.getMessages(ctx.user._id, chatId, query['p']);

    return this.jsendSerializer.successResponse({ ...result }).get();
  }
}
