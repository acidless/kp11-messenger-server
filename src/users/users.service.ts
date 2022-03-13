import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateProfileDTO, RegisterUserDTO } from './UsersDTOS';
import * as bcrypt from 'bcrypt';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UsersService {
  public constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private jwtService: JwtService,
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

  public async verifyToken(token: string) {
    if (token && token.startsWith('Bearer ')) {
      const newToken = token.substring(7);

      const data = this.jwtService.unsign(newToken);
      if (data) {
        const user = await this.getByLogin(data.login);
        if (user && user.password == data.password) {
          return user;
        }
      }
    }

    return null;
  }

  public async createProfile(login: string, profile: CreateProfileDTO) {
    return this.model.findOneAndUpdate({ login }, profile, {
      new: true,
      runValidators: true,
    });
  }
}
