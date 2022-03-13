import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user = await this.usersService.verifyToken(
      request.headers.authorization,
    );

    if (user) {
      context.switchToHttp().getRequest().user = user;
      return true;
    }

    throw new HttpException('You must be authorized for that', 403);
  }
}
