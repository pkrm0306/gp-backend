import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterVendorDto } from './dto/register-vendor.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyRecaptchaDto } from './dto/verify-recaptcha.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private extractAccessToken(req: any): string | null {
    const authHeader = String(req?.headers?.authorization || '').trim();
    if (/^Bearer\s+/i.test(authHeader)) {
      return authHeader.replace(/^Bearer\s+/i, '').trim();
    }
    const xAccessToken = req?.headers?.['x-access-token'];
    if (typeof xAccessToken === 'string' && xAccessToken.trim()) {
      return xAccessToken.trim();
    }
    if (Array.isArray(xAccessToken) && xAccessToken[0]?.trim()) {
      return xAccessToken[0].trim();
    }
    const queryToken = String(req?.query?.access_token || '').trim();
    return queryToken || null;
  }

  @Post('register-vendor')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new vendor' })
  async registerVendor(@Body() registerDto: RegisterVendorDto) {
    return this.authService.registerVendor(registerDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description:
      'Requires a **body**. In Postman/Thunder Client: Body → **raw** → **JSON**, `Content-Type: application/json`, e.g. `{"email":"you@example.com","password":"yourPassword"}`. Or Body → **x-www-form-urlencoded** with keys `email` and `password`. Do not leave Body as **none**.',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      default: {
        value: {
          email: 'user@example.com',
          password: 'YourPassword123',
          portal: 'vendor',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto, @Req() req: any) {
    const portal = this.resolvePortal(req, loginDto.portal);
    return this.authService.login(loginDto, portal);
  }

  private resolvePortal(
    req: any,
    dtoPortal?: 'admin' | 'vendor',
  ): 'admin' | 'vendor' | undefined {
    if (dtoPortal) return dtoPortal;

    const host = String(req?.headers?.host || '')
      .trim()
      .toLowerCase();
    const origin = String(req?.headers?.origin || '')
      .trim()
      .toLowerCase();
    const referer = String(req?.headers?.referer || '')
      .trim()
      .toLowerCase();
    const combined = `${host} ${origin} ${referer}`;

    if (combined.includes('localhost:3004')) return 'admin';
    if (combined.includes('localhost:3001')) return 'vendor';
    return undefined;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout current session',
    description:
      'Revokes current access token and optional refresh token to prevent reuse.',
  })
  @ApiBody({ type: LogoutDto, required: false })
  async logout(@Req() req: any, @Body() body?: LogoutDto) {
    const accessToken = this.extractAccessToken(req);
    if (!accessToken) {
      throw new UnauthorizedException('Authorization token missing');
    }
    return this.authService.logout(accessToken, body?.refreshToken);
  }

  @Post('verify-recaptcha')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify reCAPTCHA token',
    description:
      'Verifies a frontend reCAPTCHA token using RECAPTCHA_SECRET_KEY and returns whether it is valid.',
  })
  @ApiBody({ type: VerifyRecaptchaDto })
  async verifyRecaptcha(@Body() dto: VerifyRecaptchaDto) {
    const valid = await this.authService.verifyRecaptcha(dto.captchaToken);
    return {
      success: true,
      message: valid ? 'reCAPTCHA verified' : 'Invalid reCAPTCHA token',
      data: { valid },
    };
  }
}
