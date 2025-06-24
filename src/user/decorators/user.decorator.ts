import { User } from '@/prisma/generated';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (
    data: keyof User | undefined,
    ctx: ExecutionContext,
  ): User[keyof User] | User => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.user as User | undefined;
    // if (!user) {
    //   throw new UnauthorizedException('Not authorized');
    // }
    if (!user) return null;

    return data ? user[data] : user;
  },
);
