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
import { AuthGuard } from '../guards/auth.guard';
import { RequestContext } from '../../decorators/request-context.decorator';
import { include } from '../../utils/object';
import { Data } from '../../decorators/data.decorator';
import { ChatDTO } from './ChatDTO';
import { ChatsService } from './chats.service';
import JSendSerializer from 'r-jsend';

const createData = ['name'];

@Controller('chats')
export class ChatsController {
  public constructor(
    private chatsService: ChatsService,
    private jsendSerializer: JSendSerializer,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  public async createChat(
    @RequestContext() ctx,
    @Data(createData) data: ChatDTO,
  ) {
    const chat = await this.chatsService.createChat(data.name, ctx.user._id);

    return this.jsendSerializer
      .successResponse({ ...include(chat, ['users', 'name']) })
      .get();
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async getChats(@RequestContext() ctx, @Query() query) {
    let { count, chats } = await this.chatsService.getChats(
      query['q'],
      query['p'] || 0,
      ctx.user._id,
    );
    chats = chats.map((chat) => {
      return include(chat, ['users', 'name', '_id']);
    });

    return this.jsendSerializer.successResponse({ chats, count }).get();
  }
}
