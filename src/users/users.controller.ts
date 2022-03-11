import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Data } from '../../decorators/data.decorator';
import { LoginUserDTO, RegisterUserDTO } from './UsersDTOS';
import { UsersService } from './users.service';
import JSendSerializer from 'r-jsend';
import { include } from '../../utils/object';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../jwt/jwt.service';

const fill = ['login', 'password', 'email', 'passwordConfirm'];

@Controller('users')
export class UsersController {
  public constructor(
    private usersService: UsersService,
    private jsendSerializer: JSendSerializer,
    private jwtService: JwtService,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Data(fill) data: RegisterUserDTO) {
    if (data.password == data.passwordConfirm) {
      const createdUser = await this.usersService.create(data);

      const token = this.jwtService.sign({
        login: createdUser.login,
        password: createdUser.password,
      });

      return this.jsendSerializer
        .successResponse({ ...include(createdUser, ['login', 'email']), token })
        .get();
    }

    throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Data(fill) data: LoginUserDTO) {
    const user = await this.usersService.getByLogin(data.login);
    if (user && (await bcrypt.compare(data.password, user.password))) {
      const token = this.jwtService.sign({
        login: user.login,
        password: user.password,
      });

      return this.jsendSerializer
        .successResponse({ ...include(user, ['login', 'email']), token })
        .get();
    }

    throw new HttpException(
      'Login or password are invalid',
      HttpStatus.BAD_REQUEST,
    );
  }
}
