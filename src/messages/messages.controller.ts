import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RequestContext } from '../../decorators/request-context.decorator';
import { MessagesService } from './messages.service';
import JSendSerializer from 'r-jsend';

@Controller('messages')
export class MessagesController {
  public constructor(private messagesService: MessagesService, private jsendSerializer: JSendSerializer) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async getMessages(@RequestContext() ctx, @Query() query) {
    const result = await this.messagesService.getMessages(ctx.user._id, query['q'], query['p'] || 0);

    return this.jsendSerializer.successResponse({ ...result }).get();
  }
}
