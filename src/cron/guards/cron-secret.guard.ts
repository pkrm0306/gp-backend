import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CronSecretGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const secret = String(this.configService.get<string>('CRON_SECRET') ?? '').trim();
    if (!secret) {
      throw new UnauthorizedException('CRON_SECRET is not configured on the server');
    }
    const request = context.switchToHttp().getRequest<{ headers?: Record<string, string> }>();
    const auth = String(request.headers?.authorization ?? '').trim();
    const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
    if (!token || token !== secret) {
      throw new UnauthorizedException('Invalid cron authorization');
    }
    return true;
  }
}
