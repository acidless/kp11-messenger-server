import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { RegisterUserDTO } from './UsersDTOS';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
  ) {}

  public async create(user: RegisterUserDTO) {
    user.password = await this.hashPassword(user.password);
    return this.model.create(user);
  }

  public async getByLogin(login: string) {
    return this.model.findOne({ login });
  }

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }
}
