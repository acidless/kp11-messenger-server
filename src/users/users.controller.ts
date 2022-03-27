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
import { Data } from '../../decorators/data.decorator';
import { CreateProfileDTO, LoginUserDTO, RegisterUserDTO, UpdateProfileDTO } from './UsersDTOS';
import { UsersService } from './users.service';
import JSendSerializer from 'r-jsend';
import { exclude, excludeEmpty } from '../../utils/object';
import { AuthGuard } from '../guards/auth.guard';
import { RequestContext } from '../../decorators/request-context.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import FileOptions from '../../utils/image';

const loginData = ['login', 'password', 'email', 'passwordConfirm'];
const profileData = ['name', 'surname', 'phoneNumber', 'group'];
const updateProfileData = [...profileData, 'email', 'currentPassword', 'newPassword'];

@Controller('users')
export class UsersController {
  public constructor(private usersService: UsersService, private jsendSerializer: JSendSerializer) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Data(loginData) data: RegisterUserDTO) {
    const createdUser = await this.usersService.create(data);

    return this.jsendSerializer
      .successResponse({
        ...createdUser,
      })
      .get();
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Data(loginData) data: LoginUserDTO) {
    const user = await this.usersService.login(data.login, data.password);

    return this.jsendSerializer
      .successResponse({
        ...user,
      })
      .get();
  }

  @Post('/auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async auth(@RequestContext() ctx) {
    return this.jsendSerializer.successResponse({ ...exclude(ctx.user.toObject(), ['password', '__v']) }).get();
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async getUsers(@RequestContext() ctx, @Query() query) {
    let users = await this.usersService.getByName(query['q'], query['p'] || 0);
    users = users.filter((user) => user._id.toString() != ctx.user._id);

    return this.jsendSerializer.successResponse({ users }).get();
  }

  @Post('/profile')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar', FileOptions))
  public async createProfile(
    @RequestContext() ctx,
    @UploadedFile() file: Express.Multer.File,
    @Data(profileData) data: CreateProfileDTO,
  ) {
    if (file) {
      data.avatar = file.path;
    }

    const { user, token } = await this.usersService.createProfile(ctx.user, ctx.user.name, data);

    return this.jsendSerializer.successResponse({ ...user, token }).get();
  }

  @Patch('/profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar', FileOptions))
  public async updateProfile(
    @RequestContext() ctx,
    @UploadedFile() file: Express.Multer.File,
    @Data(updateProfileData) data: UpdateProfileDTO,
  ) {
    if (file) {
      data.avatar = file.path;
    }

    data = excludeEmpty(data);
    const { user, token } = await this.usersService.updateProfile(ctx.user, data);

    return this.jsendSerializer.successResponse({ ...user, token }).get();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  public async getUser(@Param('id') id) {
    const user = await this.usersService.getById(id);

    return this.jsendSerializer.successResponse({ ...user.toObject() }).get();
  }
}
