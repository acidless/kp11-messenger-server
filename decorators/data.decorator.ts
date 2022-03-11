import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/*====================*/

export const Data = createParamDecorator(
  (data: Array<string>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const modifiedData = {};

    Object.keys(request.body).forEach((key) => {
      if (data.includes(key)) {
        modifiedData[key] = request.body[key];
      }
    });

    return modifiedData;
  },
);
