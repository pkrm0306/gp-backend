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
import { ResendOtpDto } from './dto/resend-otp.dto';
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
  @ApiOperation({
    summary: 'Verify email with OTP',
    description:
      'On success, returns **gpInternalId** and **manufacturerInitial** from the linked manufacturer when set (otherwise **null**). Vendor profile GET also exposes these only after the account email is verified.',
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend vendor registration email verification OTP',
    description:
      'Sends a new 6-digit OTP to the registered email. Only for **unverified** vendor/partner accounts. ' +
      'Rate limited: 60s cooldown between requests; max 5 resends per 15 minutes per email. ' +
      'In development/staging the OTP is **123456** unless `VENDOR_REGISTRATION_OTP_FIXED` is set.',
  })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description:
      'Requires a **body**. Unknown emails return **401** with **Email not registered** (not generic invalid credentials). For the **admin portal**, send **`portal`: `"admin"`** (recommended) for correct portal/type checks. ' +
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
      'Prefer **`portal`: `"admin"`** or **`x-admin-portal`: `1`**. Without them, the API infers admin from **Referer** (`/admin` path) or **Origin** host **`greenpro-portals.vercel.app`**. Unknown email: admin → **400** **Email id is not registered**; vendor/other → **400** **User not registered**. Staff without RBAC or wrong account type → **Portal access restricted**.',
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

  /** Alias for older / alternate clients that call `POST /auth/refresh-token`. */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token (alias of POST /auth/refresh)' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
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
    summary: 'Verify reCAPTCHA token (legacy helper)',
    description:
      'Legacy helper only. Prefer sending `recaptchaToken` on the protected form endpoint so verification runs inline before business logic. Tokens are single-use — do not call this and then reuse the same token on another API.',
  })
  @ApiBody({ type: VerifyRecaptchaDto })
  async verifyRecaptcha(@Body() dto: VerifyRecaptchaDto) {
    const valid = await this.authService.verifyRecaptcha(
      dto.captchaToken || (dto as any).recaptchaToken,
    );
    return {
      success: true,
      message: valid ? 'reCAPTCHA verified' : 'Invalid reCAPTCHA token',
      data: { valid },
    };
  }
}
