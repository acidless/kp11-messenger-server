import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { JwtService } from './jwt/jwt.service';
import { ChatsModule } from './chats/chats.module';
import JSendSerializer from 'r-jsend';
import { UsersService } from './users/users.service';
import { User, UserSchema } from '../schemas/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kp11-messenger'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JSendSerializer, JwtService, UsersService],
  exports: [JSendSerializer, JwtService, UsersService],
})
export class AppModule {}
