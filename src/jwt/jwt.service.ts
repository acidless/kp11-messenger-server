import { Injectable } from '@nestjs/common';
const jwt = require('jsonwebtoken');

@Injectable()
export class JwtService {
  public sign(login: string, password: string) {
    return jwt.sign(
      {
        login,
        password,
      },
      'rubtid',
    );
  }

  public unsign(token: string) {
    return jwt.decode(token);
  }
}
