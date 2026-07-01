import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { AuthSessionInvalidationService } from '../auth-session-invalidation.service';
import { isPlatformPortalAccountType } from '../../common/utils/platform-rbac-scope.util';

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
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
    private readonly sessionInvalidation: AuthSessionInvalidationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        tokenFromAccessTokenHeader,
        ExtractJwt.fromUrlQueryParameter('access_token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret',
      passReqToCallback: true,
    });
  }

  async validate(_req: Request, payload: any) {
    if (await this.authService.isTokenRevoked(payload?.jti)) {
      throw new UnauthorizedException('Token has been revoked');
    }

    await this.sessionInvalidation.assertSessionActive({
      iat: payload?.iat,
      userId: payload?.userId,
      manufacturerId: payload?.manufacturerId,
      vendorId: payload?.vendorId,
    });

    const role = payload.role || payload.type;
    const manufacturerId = payload.manufacturerId || payload.vendorId;
    if (
      role &&
      this.authService.isVendorPortalRole(String(role)) &&
      manufacturerId
    ) {
      await this.authService.assertVendorOrganizationActive(
        String(manufacturerId),
      );
      await this.authService.assertVendorPortalUserAccountActive(
        payload.userId,
      );
    }

    if (!payload.userId || !role) {
      throw new UnauthorizedException('Invalid token payload');
    }
    if (!isPlatformPortalAccountType(String(role)) && !manufacturerId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      userId: payload.userId,
      /** Alias for vendor APIs that read `user.id` from the JWT payload */
      id: payload.userId,
      vendorUserId: payload.userId,
      manufacturerId: manufacturerId ?? undefined,
      vendorId: manufacturerId ?? undefined,
      role,
      type: role,
      name: payload.name,
      email: payload.email,
      tokenJti: payload?.jti,
    };
  }
}
