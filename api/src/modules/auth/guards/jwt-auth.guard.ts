import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return isPublic ? true : super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info instanceof Error) {
        if (info.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Authentication token has expired. Please log in again.');
        }
        if (info.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Invalid authentication token provided.');
        }
        if (info.message === 'No auth token') {
          throw new UnauthorizedException('Authentication token is missing.');
        }
      }
      throw err instanceof UnauthorizedException
        ? err
        : new UnauthorizedException(err?.message || 'Authentication token is missing or invalid.');
    }
    return user;
  }
}
