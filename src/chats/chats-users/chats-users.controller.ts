import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RequestContext } from '../../../decorators/request-context.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { ChatsUsersService } from './chats-users.service';
import JSendSerializer from 'r-jsend';
import { Data } from '../../../decorators/data.decorator';

@Controller('chats/:id/users')
export class ChatsUsersController {
  public constructor(
    private jsendSerializer: JSendSerializer,
    private chatsUsersService: ChatsUsersService,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  public async addUsers(
    @RequestContext() ctx,
    @Param() params,
    @Data(['users']) data,
  ) {
    const chat = await this.chatsUsersService.addUsers(
      params.id,
      ctx.user._id,
      data.users,
    );

    return this.jsendSerializer.successResponse({ ...chat }).get();
  }

  @Delete('/:userId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async removeUser(@RequestContext() ctx, @Param() params) {
    const chat = await this.chatsUsersService.removeUser(
      params.id,
      ctx.user._id,
      params.userId,
    );

    return this.jsendSerializer.successResponse({ ...chat }).get();
  }
}
