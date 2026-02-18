import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { VendorsService } from '../vendors/vendors.service';
import { VendorUsersService } from '../vendor-users/vendor-users.service';
import { CaptchaService } from '../common/services/captcha.service';
import { EmailService } from '../common/services/email.service';
import { RegisterVendorDto } from './dto/register-vendor.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectConnection() private connection: Connection,
    private manufacturersService: ManufacturersService,
    private vendorsService: VendorsService,
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

    const isValidCaptcha = await this.captchaService.verifyCaptcha(
      registerDto.captchaToken,
    );
    if (!isValidCaptcha) {
      throw new BadRequestException('Invalid recaptcha');
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const gpInternalId = `GP${Date.now()}`;
      const manufacturerInitial = registerDto.companyName
        .substring(0, 3)
        .toUpperCase();

      const manufacturer = await this.manufacturersService.create({
        manufacturerName: registerDto.companyName,
        gpInternalId,
        manufacturerInitial,
        manufacturerStatus: 1,
      }, session);

      const vendor = await this.vendorsService.create({
        manufacturerId: manufacturer._id,
        vendorName: registerDto.companyName,
        vendorEmail: registerDto.email,
        vendorPhone: registerDto.phone,
        vendorStatus: 0,
      }, session);

      const otp = '123456';
      const vendorUser = await this.vendorUsersService.create({
        vendorId: vendor._id,
        name: registerDto.companyName,
        email: registerDto.email,
        phone: registerDto.phone,
        password: registerDto.password,
        type: 'vendor',
        status: 1,
        otp,
        isVerified: false,
      }, session);

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

    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    if (user.status !== 1) {
      throw new UnauthorizedException('Account is inactive');
    }

    const payload = {
      userId: user._id.toString(),
      vendorId: user.vendorId.toString(),
      role: user.type,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
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
}
