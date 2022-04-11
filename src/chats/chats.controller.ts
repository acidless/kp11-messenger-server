import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RequestContext } from '../../decorators/request-context.decorator';
import { Data } from '../../decorators/data.decorator';
import { ChatDTO, ChatUpdateDTO } from './ChatDTO';
import { ChatsService } from './chats.service';
import JSendSerializer from 'r-jsend';
import { FileInterceptor } from '@nestjs/platform-express';
import FileOptions from '../../utils/image';
import { ChatsModifyService } from './chats-modify.service';

const createData = ['name', 'users'];
const updateData = ['name', 'avatar'];

@Controller('chats')
export class ChatsController {
  public constructor(
    private chatsService: ChatsService,
    private chatsModifyService: ChatsModifyService,
    private jsendSerializer: JSendSerializer,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  public async createChat(@RequestContext() ctx, @Data(createData) data: ChatDTO) {
    const chat = await this.chatsModifyService.createChat(data.name, ctx.user._id, data.users);

    return this.jsendSerializer.successResponse({ ...chat }).get();
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async getChats(@RequestContext() ctx, @Query() query) {
    const result = await this.chatsService.getChats(query['q'], query['p'] || 0, ctx.user._id);

    return this.jsendSerializer.successResponse({ ...result }).get();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async getChat(@RequestContext() ctx, @Param('id') id) {
    const chat = await this.chatsService.getChat(id);

    this.chatsService.isUserInChat(chat, ctx.user._id);

    return this.jsendSerializer.successResponse({ ...chat.toObject() }).get();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar', FileOptions))
  public async updateChat(
    @RequestContext() ctx,
    @Param('id') id,
    @Data(updateData) data: ChatUpdateDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      data.avatar = file.path;
    }

    const chat = await this.chatsModifyService.updateChat(id, ctx.user._id, data);

    return this.jsendSerializer.successResponse({ ...chat.toObject() }).get();
  }
}
