import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ITokenStategyResponse } from '../../auth/models';

export const GetUser = createParamDecorator(
  (data: keyof ITokenStategyResponse | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
