import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { JwtService } from './jwt/jwt.service';
import JSendSerializer from 'r-jsend';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/kp11-messenger'),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, JSendSerializer, JwtService],
  exports: [JSendSerializer, JwtService],
})
export class AppModule {}
