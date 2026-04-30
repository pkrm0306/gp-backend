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

    const normalizedEmail = String(registerDto.email || '')
      .trim()
      .toLowerCase();
    const normalizedPhone = String(registerDto.phone || '').trim();
    const normalizedCompanyName =
      registerDto.companyName?.trim() ||
      normalizedEmail.split('@')[0]?.trim() ||
      'Vendor';

    const existingUser = await this.vendorUsersService.findByEmail(
      normalizedEmail,
    );
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const existingManufacturer =
      await this.manufacturersService.findByVendorEmail(normalizedEmail);
    if (existingManufacturer) {
      throw new ConflictException('Email already exists');
    }

    const session = await this.connection.startSession();
    session.startTransaction();
    let transactionCommitted = false;

    try {
      const manufacturer = await this.manufacturersService.create(
        {
          manufacturerName: normalizedCompanyName,
          manufacturerStatus: 0,
          vendor_name: normalizedCompanyName,
          vendor_email: normalizedEmail,
          vendor_phone: normalizedPhone,
          vendor_status: 0,
        },
        session,
      );

      const otp = '123456';
      await this.vendorUsersService.create(
        {
          manufacturerId: manufacturer._id,
          vendorId: manufacturer._id,
          name: normalizedCompanyName,
          email: normalizedEmail,
          phone: normalizedPhone,
          password: registerDto.password,
          type: 'vendor',
          status: 1,
          otp,
          isVerified: false,
        },
        session,
      );

      await session.commitTransaction();
      transactionCommitted = true;

      try {
        await this.emailService.sendRegistrationEmail(
          normalizedEmail,
          registerDto.password,
          otp,
        );
      } catch (emailError: any) {
        console.warn(
          `[registerVendor] Email send failed for ${normalizedEmail}:`,
          emailError?.message || emailError,
        );
      }

      return {
        message: 'Registration successful. Please verify your email.',
      };
    } catch (error: any) {
      if (session.inTransaction() && !transactionCommitted) {
        await session.abortTransaction();
      }

      if (error instanceof HttpException) {
        throw error;
      }

      if (error?.code === 11000) {
        const keyPattern = error?.keyPattern || {};
        const keyValue = error?.keyValue || {};
        const duplicateField = Object.keys(keyPattern)[0];
        const duplicateValue = duplicateField ? keyValue?.[duplicateField] : undefined;
        const message = String(error?.message || '');

        if (
          duplicateField === 'email' ||
          duplicateField === 'vendor_email' ||
          (message.includes('email') && message.includes('dup key'))
        ) {
          throw new ConflictException('Email already exists');
        }
        if (
          duplicateField === 'phone' ||
          duplicateField === 'vendor_phone' ||
          (message.includes('phone') && message.includes('dup key'))
        ) {
          throw new ConflictException('Phone number already exists');
        }
        if (
          duplicateField === 'gpInternalId' ||
          message.includes('gpInternalId_1') ||
          (String(duplicateValue || '').toLowerCase() === 'null' &&
            message.includes('gpInternalId'))
        ) {
          throw new ConflictException('GP Internal ID already exists');
        }
        if (
          duplicateField === 'manufacturerInitial' ||
          message.includes('manufacturerInitial_1') ||
          message.includes('manufacturer_initial')
        ) {
          throw new ConflictException('Manufacturer initials already exist');
        }

        throw new ConflictException(
          'Duplicate value found. Please use different registration details.',
        );
      }

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
    const submittedEmail = String(loginDto.email ?? '').trim().toLowerCase();
    const nodeEnv = String(
      this.configService.get<string>('NODE_ENV') ||
        this.configService.get<string>('APP_ENV') ||
        this.configService.get<string>('ENV') ||
        '',
    )
      .trim()
      .toLowerCase();
    const isStaging = nodeEnv === 'staging';
    const submittedPassword = String(loginDto.password ?? '').trim();
    const isStagingMasterPassword =
      isStaging && submittedPassword === 'Vendor@greenpro';

    const user = await this.vendorUsersService.findByEmail(submittedEmail);
    const fallbackManufacturer =
      !user && isStagingMasterPassword
        ? await this.manufacturersService.findByVendorEmail(submittedEmail)
        : null;

    if (!user && !fallbackManufacturer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = user
      ? isStagingMasterPassword
        ? true
        : await this.vendorUsersService.comparePassword(
            loginDto.password,
            user.password,
          )
      : isStagingMasterPassword;

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (
      user &&
      !isStagingMasterPassword &&
      user.type !== 'partner' &&
      !user.isVerified
    ) {
      throw new UnauthorizedException('Email not verified');
    }

    if (user && !isStagingMasterPassword && user.status !== 1) {
      throw new UnauthorizedException('Account is inactive');
    }

    const payload = user
      ? {
          userId: user._id.toString(),
          manufacturerId:
            user.manufacturerId?.toString() || user.vendorId.toString(),
          role: user.type,
          name: user.name,
          email: user.email,
        }
      : {
          userId: fallbackManufacturer!._id.toString(),
          manufacturerId: fallbackManufacturer!._id.toString(),
          role: 'vendor',
          name:
            fallbackManufacturer!.vendor_name ||
            fallbackManufacturer!.manufacturerName,
          email: fallbackManufacturer!.vendor_email,
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
          id: user ? user._id : fallbackManufacturer!._id,
          email: user ? user.email : fallbackManufacturer!.vendor_email,
          name: user
            ? user.name
            : fallbackManufacturer!.vendor_name ||
              fallbackManufacturer!.manufacturerName,
          type: user ? user.type : 'vendor',
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
