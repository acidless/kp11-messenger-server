import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest();
  },
);
