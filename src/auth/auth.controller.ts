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
      'Requires a **body**. For the **admin portal**, send **`portal`: `"admin"`** (recommended) so unknown emails return **Email id is not registered** instead of generic invalid credentials. ' +
      'If the API runs on a different port than the SPA, also send header **`x-admin-portal`: `1`** when `Origin` may not identify the admin app. ' +
      'Success responses for admin/staff include **designation**, **mobile**, **vendorUserId** on **`user`**.',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      vendor: {
        summary: 'Vendor portal',
        value: {
          email: 'user@example.com',
          password: 'YourPassword123',
          portal: 'vendor',
        },
      },
      admin: {
        summary: 'Admin portal',
        value: {
          email: 'staff@example.com',
          password: 'YourPassword123',
          portal: 'admin',
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

    /** Admin SPA often calls API on another port; Origin may be omitted — clients may send this header. */
    const xAdminPortal = String(req?.headers?.['x-admin-portal'] ?? '')
      .trim()
      .toLowerCase();
    if (['1', 'true', 'yes', 'admin'].includes(xAdminPortal)) {
      return 'admin';
    }

    const host = String(req?.headers?.host || '')
      .trim()
      .toLowerCase();
    const origin = String(req?.headers?.origin || '')
      .trim()
      .toLowerCase();
    const referer = String(req?.headers?.referer || '')
      .trim()
      .toLowerCase();

    /**
     * Production admin SPA on Vercel: **Origin** is only the hostname
     * (`https://greenpro-portals.vercel.app`) — it does **not** contain the
     * string `admin`, so the old `greenpro-portals` + `admin` check never matched.
     * **Referer** may include `/admin/...` when the browser sends it.
     */
    if (referer.includes('/admin')) {
      return 'admin';
    }
    if (
      origin.includes('greenpro-portals.vercel.app') ||
      referer.includes('greenpro-portals.vercel.app')
    ) {
      return 'admin';
    }

    const combined = `${host} ${origin} ${referer}`;

    if (combined.includes('localhost:3004')) return 'admin';
    if (combined.includes('localhost:3001')) return 'vendor';
    if (combined.includes('admin/login')) return 'admin';
    if (
      combined.includes('greenpro-portals') &&
      combined.includes('admin')
    ) {
      return 'admin';
    }
    return undefined;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description:
      'Prefer **`portal`: `"admin"`** or **`x-admin-portal`: `1`**. Without them, the API infers admin from **Referer** (`/admin` path) or **Origin** host **`greenpro-portals.vercel.app`**. Unknown emails → **Email id is not registered**; staff without RBAC or wrong account type → **Portal access restricted**.',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Req() req: any,
  ) {
    const portal = this.resolvePortal(req, forgotPasswordDto.portal);
    return this.authService.forgotPassword(forgotPasswordDto, portal);
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
