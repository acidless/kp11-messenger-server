import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { RegisterUserDTO } from './UsersDTOS';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../jwt/jwt.service';
import { exclude } from '../../utils/object';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  public constructor(@InjectModel(User.name) private model: Model<UserDocument>, private jwtService: JwtService) {}

  public async create(user: RegisterUserDTO) {
    if (user.password !== user.passwordConfirm) {
      throw new BadRequestException('Пароли не совпадают');
    }

    user.password = await this.hashPassword(user.password);
    const createdUser = await this.model.create(user);
    const token = this.jwtService.sign(createdUser.login, createdUser.password);

    return { ...exclude(createdUser.toObject(), ['password', '__v']), token };
  }

  public async login(login: string, password: string) {
    const user = await this.model.findOne({ login });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = this.jwtService.sign(user.login, user.password);

      return { ...exclude(user.toObject(), ['password', '__v']), token };
    }

    throw new BadRequestException('Неверный логин или пароль');
  }

  public async getByName(name: string, page: number) {
    const PER_PAGE = 20;
    if (!name) {
      throw new BadRequestException('Укажите имя');
    }

    const regexpes = name.split(' ');
    const regex = regexpes.join('|').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let findFilters: any = {
      name: { $regex: regex, $options: 'i' },
      surname: { $regex: regex, $options: 'i' },
    };

    if (regexpes.length == 1) {
      findFilters = {
        $or: [{ name: findFilters['name'] }, { surname: findFilters['surname'] }],
      };
    }

    const users = await this.model
      .find(findFilters)
      .skip(PER_PAGE * page)
      .limit(PER_PAGE)
      .select('_id name surname avatar');

    return {
      users,
      isLastPage: users.length === 0,
    };
  }

  public async getById(id: string) {
    const user = await this.model.findById(id).select('-password -__v');

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  public async verifyToken(token: string) {
    if (token && token.startsWith('Bearer ')) {
      const newToken = token.substring(7);

      const data = this.jwtService.unsign(newToken);
      if (data) {
        const user = await this.model.findOne({ login: data.login });
        if (user && user.password == data.password) {
          return user;
        }
      }
    }

    return null;
  }

  public async createProfile(ctxUser: User, userName: string, profile: any) {
    if (!profile.name || !profile.group) {
      throw new BadRequestException('Вы должны указать имя и группу');
    }

    if (userName) {
      throw new BadRequestException('Ваш профиль уже существует');
    }

    return this.updateProfile(ctxUser, profile);
  }

  public async updateProfile(ctxUser: User, profile: any) {
    let token = '';

    if (profile.currentPassword && profile.newPassword) {
      if (await bcrypt.compare(profile.currentPassword, ctxUser.password)) {
        profile.password = await this.hashPassword(profile.newPassword);
        token = this.jwtService.sign(ctxUser.login, profile.password);
      } else {
        throw new BadRequestException('Неверный пароль');
      }
    }
    if (ctxUser.avatar && profile.avatar) {
      fs.unlink(path.resolve(__dirname, '../../../../', ctxUser.avatar), (err) => {
        console.log(err);
      });
    }

    const user = await this.model
      .findOneAndUpdate({ login: ctxUser.login }, profile, {
        new: true,
        runValidators: true,
      })
      .select('-password -__v');

    if (!user) {
      throw new NotFoundException('Аккаунт не найден');
    }

    return { user: user.toObject(), token };
  }
}
