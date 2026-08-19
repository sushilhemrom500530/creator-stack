import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) return null;
    if (data === 'sub' || data === 'id' || data === 'userId') {
      return request.user.sub || request.user.id || request.user._id || request.user.userId;
    }
    return data ? request.user[data] : request.user;
  },
);

