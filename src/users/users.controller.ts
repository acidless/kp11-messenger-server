import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Data } from '../../decorators/data.decorator';
import { CreateProfileDTO, LoginUserDTO, RegisterUserDTO } from './UsersDTOS';
import { UsersService } from './users.service';
import JSendSerializer from 'r-jsend';
import { include } from '../../utils/object';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../jwt/jwt.service';
import { AuthGuard } from '../guards/auth.guard';
import { RequestContext } from '../../decorators/request-context.decorator';

const loginData = ['login', 'password', 'email', 'passwordConfirm'];
const profileData = ['name', 'surname', 'phoneNumber', 'group'];
const includeData = [
  'login',
  'email',
  'name',
  'surname',
  'phoneNumber',
  'group',
];

@Controller('users')
export class UsersController {
  public constructor(
    private usersService: UsersService,
    private jsendSerializer: JSendSerializer,
    private jwtService: JwtService,
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Data(loginData) data: RegisterUserDTO) {
    if (data.password == data.passwordConfirm) {
      const createdUser = await this.usersService.create(data);

      const token = this.jwtService.sign({
        login: createdUser.login,
        password: createdUser.password,
      });

      return this.jsendSerializer
        .successResponse({
          ...include(createdUser, includeData),
          token,
        })
        .get();
    }

    throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Data(loginData) data: LoginUserDTO) {
    const user = await this.usersService.getByLogin(data.login);
    if (user && (await bcrypt.compare(data.password, user.password))) {
      const token = this.jwtService.sign({
        login: user.login,
        password: user.password,
      });

      return this.jsendSerializer
        .successResponse({
          ...include(user, includeData),
          token,
        })
        .get();
    }

    throw new HttpException(
      'Login or password are invalid',
      HttpStatus.BAD_REQUEST,
    );
  }

  @Post('/auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async auth(@RequestContext() ctx) {
    return this.jsendSerializer
      .successResponse({ ...include(ctx.user, includeData) })
      .get();
  }

  @Post('/profile')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  public async createProfile(
    @RequestContext() ctx,
    @Data(profileData) data: CreateProfileDTO,
  ) {
    if (!data.name || !data.group) {
      throw new HttpException(
        'You must provide name and group fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!ctx.user.name) {
      const user = await this.usersService.createProfile(ctx.user.login, data);

      if (!user) {
        throw new HttpException(
          'Cannot find your account',
          HttpStatus.NOT_FOUND,
        );
      }

      return this.jsendSerializer
        .successResponse({ ...include(user, includeData) })
        .get();
    }

    throw new HttpException(
      'Your profile is already created',
      HttpStatus.BAD_REQUEST,
    );
  }
}
