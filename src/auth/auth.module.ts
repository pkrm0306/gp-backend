import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { VendorsModule } from '../vendors/vendors.module';
import { VendorUsersModule } from '../vendor-users/vendor-users.module';
import { CaptchaService } from '../common/services/captcha.service';
import { EmailService } from '../common/services/email.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'secret',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m',
        },
      }),
      inject: [ConfigService],
    }),
    ManufacturersModule,
    VendorsModule,
    VendorUsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CaptchaService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
