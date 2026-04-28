import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { VendorUsersService } from '../vendor-users/vendor-users.service';
import { CaptchaService } from '../common/services/captcha.service';
import { EmailService } from '../common/services/email.service';
import { RegisterVendorDto } from './dto/register-vendor.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectConnection() private connection: Connection,
    private manufacturersService: ManufacturersService,
    private vendorUsersService: VendorUsersService,
    private captchaService: CaptchaService,
    private emailService: EmailService,
  ) {}

  async registerVendor(registerDto: RegisterVendorDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.vendorUsersService.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Temporary bypass: captcha is ignored for vendor registration.

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const manufacturer = await this.manufacturersService.create(
        {
          manufacturerName: registerDto.companyName,
          gpInternalId: null,
          manufacturerInitial: null,
          manufacturerStatus: 0,
          vendor_name: registerDto.companyName,
          vendor_email: registerDto.email,
          vendor_phone: registerDto.phone,
          vendor_status: 0,
        },
        session,
      );

      const otp = '123456';
      await this.vendorUsersService.create(
        {
          manufacturerId: manufacturer._id,
          vendorId: manufacturer._id,
          name: registerDto.companyName,
          email: registerDto.email,
          phone: registerDto.phone,
          password: registerDto.password,
          type: 'vendor',
          status: 1,
          otp,
          isVerified: false,
        },
        session,
      );

      await session.commitTransaction();

      await this.emailService.sendRegistrationEmail(
        registerDto.email,
        registerDto.password,
        otp,
      );

      return {
        message: 'Registration successful. Please verify your email.',
      };
    } catch (error) {
      // Keep known HTTP errors intact for client-friendly responses.
      if (error instanceof HttpException) {
        await session.abortTransaction();
        throw error;
      }

      // Convert duplicate key DB errors into a stable 409 response.
      if ((error as any)?.code === 11000) {
        await session.abortTransaction();
        throw new ConflictException(
          'Email already exists. Please use a different email.',
        );
      }

      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    if (verifyOtpDto.otp !== '123456') {
      throw new BadRequestException('Invalid OTP');
    }

    const user = await this.vendorUsersService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp,
    );

    if (!user) {
      throw new BadRequestException('Invalid OTP or email');
    }

    return {
      message: 'Email verified successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.vendorUsersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.vendorUsersService.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.type !== 'partner' && !user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    if (user.status !== 1) {
      throw new UnauthorizedException('Account is inactive');
    }

    const manufacturerId =
      user.manufacturerId?.toString() || user.vendorId?.toString();
    if (!manufacturerId && user.type !== 'admin' && user.type !== 'super_admin') {
      // Legacy/broken mapping in DB should not crash login with 500.
      throw new UnauthorizedException('Account mapping is incomplete');
    }

    const payload = {
      userId: user._id.toString(),
      ...(manufacturerId ? { manufacturerId } : {}),
      role: user.type,
      name: user.name,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '10h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return {
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          type: user.type,
        },
      },
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.vendorUsersService.findByEmail(
      forgotPasswordDto.email,
    );

    if (!user) {
      return {
        message:
          'If the email exists, a new password has been sent to your email.',
      };
    }

    const newPassword = crypto.randomBytes(8).toString('hex');
    await this.vendorUsersService.update(user._id.toString(), {
      password: newPassword,
    });

    await this.emailService.sendPasswordResetEmail(
      forgotPasswordDto.email,
      newPassword,
    );

    return {
      message: 'New password has been sent to your email',
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const secret = this.configService.get<string>('JWT_SECRET') || 'secret';

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!payload?.userId || !payload?.role) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }
    const isPlatformAdmin =
      payload.role === 'admin' || payload.role === 'super_admin';
    if (!isPlatformAdmin && !(payload.manufacturerId || payload.vendorId)) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    const newPayload: Record<string, unknown> = {
      userId: payload.userId,
      role: payload.role,
    };
    const mid = payload.manufacturerId || payload.vendorId;
    if (mid) {
      newPayload.manufacturerId = mid;
    }
    if (payload.name) {
      newPayload.name = payload.name;
    }
    if (payload.email) {
      newPayload.email = payload.email;
    }

    const accessToken = this.jwtService.sign(newPayload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '10h',
    });

    const refreshToken = this.jwtService.sign(newPayload, {
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return {
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}
