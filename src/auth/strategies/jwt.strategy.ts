import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

function tokenFromAccessTokenHeader(req: Request): string | null {
  const h = req.headers['x-access-token'];
  if (typeof h === 'string' && h.trim()) {
    return h.trim();
  }
  if (Array.isArray(h) && h[0]?.trim()) {
    return h[0].trim();
  }
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        tokenFromAccessTokenHeader,
        ExtractJwt.fromUrlQueryParameter('access_token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret',
    });
  }

  async validate(payload: any) {
    const manufacturerId = payload.manufacturerId || payload.vendorId;
    if (!payload.userId || !manufacturerId || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      userId: payload.userId,
      manufacturerId,
      vendorId: manufacturerId,
      role: payload.role,
    };
  }
}
