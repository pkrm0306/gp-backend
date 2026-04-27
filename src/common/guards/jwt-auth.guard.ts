import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Passport-JWT provides details in `info` when auth fails.
    if (err) {
      throw err;
    }

    if (!user) {
      const infoName = info?.name;
      const infoMessage: string | undefined = info?.message;

      if (infoName === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }

      // When the Authorization header is missing, passport-jwt typically sets:
      // info = { name: 'Error', message: 'No auth token' }
      if (infoMessage?.toLowerCase().includes('no auth token')) {
        throw new UnauthorizedException('Authorization token missing');
      }

      if (infoMessage) {
        throw new UnauthorizedException(infoMessage);
      }

      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
