import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSessionInvalidationService } from './auth-session-invalidation.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { VendorUsersModule } from '../vendor-users/vendor-users.module';
import { CaptchaService } from '../common/services/captcha.service';
import { EmailService } from '../common/services/email.service';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '10h',
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => ManufacturersModule),
    VendorUsersModule,
    RbacModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthSessionInvalidationService,
    JwtStrategy,
    CaptchaService,
    EmailService,
  ],
  exports: [AuthService, AuthSessionInvalidationService, JwtStrategy],
})
export class AuthModule {}
