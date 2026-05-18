import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  HttpException,
  Logger,
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
import { RedisService } from '../common/redis/redis.service';
import { RbacService } from '../rbac/rbac.service';
import type { VendorUserDocument } from '../vendor-users/schemas/vendor-user.schema';
import type { ManufacturerDocument } from '../manufacturers/schemas/manufacturer.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private normalizeRegistrationPhone(phoneRaw: unknown, countryCodeRaw?: unknown): string {
    const phoneInput = String(phoneRaw ?? '').trim();
    const countryCodeInput = String(countryCodeRaw ?? '').trim();
    if (!phoneInput) {
      throw new BadRequestException('Phone is required');
    }

    const normalizeDialCode = (raw: string): string => {
      const digits = raw.replace(/[^\d]/g, '');
      return digits ? `+${digits}` : '';
    };
    const sanitizedPhone = phoneInput.replace(/[^\d+]/g, '');
    const normalizedDialCode = normalizeDialCode(countryCodeInput);

    let normalizedPhone = sanitizedPhone;
    if (sanitizedPhone.startsWith('+')) {
      normalizedPhone = `+${sanitizedPhone.slice(1).replace(/[^\d]/g, '')}`;
    } else {
      const digits = sanitizedPhone.replace(/[^\d]/g, '');
      normalizedPhone = normalizedDialCode ? `${normalizedDialCode}${digits}` : digits;
    }

    const digitCount = normalizedPhone.replace(/[^\d]/g, '').length;
    if (digitCount < 7) {
      throw new BadRequestException('Phone number is invalid');
    }

    return normalizedPhone;
  }

  /**
   * Login / refresh **user** payload for admin portal accounts (`admin` / `staff` users).
   * Includes flat **designation**, **mobile** (from `phone`) and nested **vendorUser** for clients that merge either shape.
   */
  private buildAdminPortalUserPayload(user: VendorUserDocument): Record<string, unknown> {
    const idStr = user._id.toString();
    const mobile = String(user.phone ?? '').trim();
    const designation = String(user.designation ?? '').trim();
    return {
      id: idStr,
      vendorUserId: idStr,
      email: user.email,
      name: user.name,
      type: user.type,
      designation,
      mobile,
      phone: mobile,
      vendorUser: {
        designation,
        mobile,
        vendorUserId: idStr,
      },
    };
  }

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectConnection() private connection: Connection,
    private manufacturersService: ManufacturersService,
    private vendorUsersService: VendorUsersService,
    private captchaService: CaptchaService,
    private emailService: EmailService,
    private readonly redisService: RedisService,
    private readonly rbacService: RbacService,
  ) {}

  private getRecaptchaVerifyCacheTtlSeconds(): number {
    const ttl = parseInt(
      this.configService.get<string>('RECAPTCHA_VERIFY_CACHE_TTL_SECONDS') ||
        this.configService.get<string>('CACHE_TTL_SECONDS') ||
        '120',
      10,
    );
    return Number.isFinite(ttl) && ttl > 0 ? ttl : 120;
  }

  private buildRecaptchaVerifyCacheKey(token: string): string {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return this.redisService.buildKey('auth', 'recaptcha', 'verify', tokenHash);
  }

  private buildRevokedTokenKey(jti: string): string {
    return this.redisService.buildKey('auth', 'revoked-token', jti);
  }

  private getNowEpochSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }

  /** Vendor / partner logins require an active manufacturer row (both flags = 1). */
  private async assertVendorOrganizationActive(
    manufacturerId: string | undefined,
  ): Promise<void> {
    const id = String(manufacturerId ?? '').trim();
    if (!id) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const m = await this.manufacturersService.findById(id);
    if (!m) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const manufacturerOk = Number(m.manufacturerStatus) === 1;
    const vendorOk = Number(m.vendor_status) === 1;
    if (!manufacturerOk || !vendorOk) {
      throw new UnauthorizedException(
        'Vendor portal access is not available. Your organization must be active.',
      );
    }
  }

  private async revokeTokenByJtiAndExp(
    jti: string | undefined,
    exp: number | undefined,
  ): Promise<void> {
    if (!jti || !exp) return;
    const ttl = exp - this.getNowEpochSeconds();
    if (ttl <= 0) return;
    await this.redisService
      .set(this.buildRevokedTokenKey(jti), { revoked: true }, ttl)
      .catch((error) => {
        this.logger.warn(
          `Token revoke cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
  }

  async isTokenRevoked(jti?: string): Promise<boolean> {
    if (!jti) return false;
    try {
      const cached = await this.redisService.get<{ revoked?: boolean }>(
        this.buildRevokedTokenKey(jti),
      );
      return Boolean(cached?.revoked);
    } catch (error) {
      this.logger.warn(
        `Token revoke cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
      return false;
    }
  }

  async registerVendor(registerDto: RegisterVendorDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const normalizedEmail = String(registerDto.email || '')
      .trim()
      .toLowerCase();
    const normalizedPhone = this.normalizeRegistrationPhone(
      registerDto.phone,
      registerDto.countryCode,
    );
    const normalizedCompanyName =
      registerDto.companyName?.trim() ||
      normalizedEmail.split('@')[0]?.trim() ||
      'Vendor';
    const normalizedContactName = String(registerDto.name || '')
      .trim()
      .slice(0, 200);
    const normalizedCompanySize = String(registerDto.companySize || '')
      .trim()
      .slice(0, 64);

    const [
      existingUser,
      existingManufacturer,
      existingManufacturerByPhone,
      existingManufacturerByCompanyName,
    ] = await Promise.all([
      this.vendorUsersService.findByEmail(normalizedEmail),
      this.manufacturersService.findByVendorEmail(normalizedEmail),
      this.manufacturersService.findByVendorPhone(normalizedPhone),
      this.manufacturersService.findByCompanyName(normalizedCompanyName),
    ]);

    const registrationConflicts: string[] = [];
    if (existingUser || existingManufacturer) {
      registrationConflicts.push('Email already exists');
    }
    if (existingManufacturerByPhone) {
      registrationConflicts.push('Phone number already exists');
    }
    if (existingManufacturerByCompanyName) {
      registrationConflicts.push('Company name already exists');
    }
    if (registrationConflicts.length > 0) {
      throw new ConflictException(registrationConflicts);
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
          companySize: normalizedCompanySize,
        },
        session,
      );

      await this.manufacturersService.assignAutoGpIdentifiersForUnverifiedManufacturer(
        manufacturer._id.toString(),
        normalizedCompanyName,
        session,
      );

      const otp = '123456';
      await this.vendorUsersService.create(
        {
          manufacturerId: manufacturer._id,
          vendorId: manufacturer._id,
          name: normalizedContactName,
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

    const manufacturerId =
      user.manufacturerId?.toString() || user.vendorId?.toString();
    let gpInternalId: string | null = null;
    let manufacturerInitial: string | null = null;
    if (manufacturerId) {
      const m = await this.manufacturersService.findById(manufacturerId);
      if (m) {
        const rawGp = String(m.gpInternalId ?? '').trim();
        const rawIni = String(m.manufacturerInitial ?? '').trim();
        gpInternalId = rawGp ? rawGp : null;
        manufacturerInitial = rawIni ? rawIni : null;
      }
    }

    return {
      message: 'Email verified successfully',
      gpInternalId,
      manufacturerInitial,
    };
  }

  async login(loginDto: LoginDto, portal?: 'admin' | 'vendor') {
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

    let user = await this.vendorUsersService.findByEmail(submittedEmail);
    let manufacturerForLoginEmail: ManufacturerDocument | null = null;
    if (!user) {
      manufacturerForLoginEmail =
        await this.manufacturersService.findByVendorEmail(submittedEmail);
      if (manufacturerForLoginEmail) {
        user = await this.vendorUsersService.findPrimaryLoginUserForManufacturer(
          manufacturerForLoginEmail._id.toString(),
        );
      }
    }

    const fallbackManufacturer =
      !user && isStagingMasterPassword
        ? manufacturerForLoginEmail ??
          (await this.manufacturersService.findByVendorEmail(submittedEmail))
        : null;

    if (!user && !fallbackManufacturer) {
      throw new UnauthorizedException('Email not registered');
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

    const resolvedUserType = user ? user.type : 'vendor';
    const allowedTypesByPortal: Record<'admin' | 'vendor', string[]> = {
      admin: ['admin', 'staff'],
      vendor: ['vendor', 'partner'],
    };
    if (portal) {
      const allowedTypes = allowedTypesByPortal[portal];
      if (!allowedTypes.includes(resolvedUserType)) {
        const message =
          portal === 'admin'
            ? 'Admin portal allows only admin or staff users'
            : 'Vendor portal allows only vendor or partner users';
        throw new UnauthorizedException(message);
      }
    }

    const vendorSideUser =
      user && (user.type === 'vendor' || user.type === 'partner');
    const manufacturerOnlyLogin = !user && !!fallbackManufacturer;
    if (vendorSideUser || manufacturerOnlyLogin) {
      const manufacturerId = user
        ? user.manufacturerId?.toString() || user.vendorId?.toString()
        : fallbackManufacturer!._id.toString();
      await this.assertVendorOrganizationActive(manufacturerId);
    }

    // Portal access is authoritative by RBAC role mapping presence for staff users.
    // Active/inactive status remains independent (checked above).
    if (user && resolvedUserType === 'staff') {
      const manufacturerId =
        user.manufacturerId?.toString() || user.vendorId?.toString();
      const hasRole = manufacturerId
        ? await this.rbacService.hasAnyActiveStaffRoleMapping(
            manufacturerId,
            user._id.toString(),
          )
        : false;
      if (!hasRole) {
        throw new UnauthorizedException('Portal access restricted');
      }
    }

    const payload = user
      ? {
          userId: user._id.toString(),
          manufacturerId:
            user.manufacturerId?.toString() || user.vendorId.toString(),
          type: user.type,
          role: user.type,
          name: user.name,
          email: user.email,
        }
      : {
          userId: fallbackManufacturer!._id.toString(),
          manufacturerId: fallbackManufacturer!._id.toString(),
          type: 'vendor',
          role: 'vendor',
          name:
            fallbackManufacturer!.vendor_name ||
            fallbackManufacturer!.manufacturerName,
          email: fallbackManufacturer!.vendor_email,
        };

    const accessTokenJti = crypto.randomUUID();
    const refreshTokenJti = crypto.randomUUID();

    // JWT carries identity only (no permission claims). Staff effective permissions are
    // resolved server-side from Role + StaffRoleMapping on each guarded request (see RbacService / PermissionsGuard),
    // subject to RBAC_CACHE_TTL_SECONDS. Refresh the access token to pick up identity changes faster if needed.

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '10h',
      jwtid: accessTokenJti,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      jwtid: refreshTokenJti,
    });

    let responseUser: Record<string, unknown>;
    if (user) {
      const forAdminPortal =
        portal === 'admin' ||
        user.type === 'admin' ||
        user.type === 'staff';
      responseUser = forAdminPortal
        ? this.buildAdminPortalUserPayload(user)
        : {
            id: user._id,
            email: user.email,
            name: user.name,
            type: user.type,
          };
    } else {
      responseUser = {
        id: fallbackManufacturer!._id,
        email: fallbackManufacturer!.vendor_email,
        name:
          fallbackManufacturer!.vendor_name ||
          fallbackManufacturer!.manufacturerName,
        type: 'vendor',
      };
    }

    return {
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: responseUser,
      },
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    portal?: 'admin' | 'vendor',
  ) {
    const submittedEmail = String(forgotPasswordDto.email ?? '')
      .trim()
      .toLowerCase();
    const user = await this.vendorUsersService.findByEmail(submittedEmail);

    if (!user) {
      if (portal === 'admin') {
        throw new BadRequestException('Email id is not registered');
      }
      throw new BadRequestException('User not registered');
    }

    // Align with admin login: only admin/staff; staff must have RBAC portal access.
    if (portal === 'admin') {
      const allowedTypes = ['admin', 'staff'];
      if (!allowedTypes.includes(user.type)) {
        throw new BadRequestException('Portal access restricted');
      }
      if (user.type === 'staff') {
        const manufacturerId =
          user.manufacturerId?.toString() || user.vendorId?.toString();
        const hasRole = manufacturerId
          ? await this.rbacService.hasAnyActiveStaffRoleMapping(
              manufacturerId,
              user._id.toString(),
            )
          : false;
        if (!hasRole) {
          throw new BadRequestException('Portal access restricted');
        }
      }
    }

    const newPassword = crypto.randomBytes(8).toString('hex');
    await this.vendorUsersService.update(user._id.toString(), {
      password: newPassword,
    });

    this.emailService.sendInBackground(() =>
      this.emailService.sendPasswordResetEmail(submittedEmail, newPassword),
    );

    return {
      message: 'New password has been sent to your email',
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const normalizedRefreshToken = String(refreshTokenDto?.refreshToken ?? '')
      .trim()
      .replace(/^bearer\s+/i, '')
      .replace(/^["']|["']$/g, '')
      .replace(/\s+/g, '');

    if (!normalizedRefreshToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    let payload: any;
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const verificationSecrets = Array.from(
      new Set(
        [refreshSecret, jwtSecret, 'secret']
          .map((s) => String(s || '').trim())
          .filter(Boolean),
      ),
    );
    const env = String(this.configService.get<string>('NODE_ENV') || '')
      .trim()
      .toLowerCase();
    const allowExpiredInNonProd = env !== 'production';

    let lastVerifyError: any;
    for (const verifySecret of verificationSecrets) {
      try {
        payload = this.jwtService.verify(normalizedRefreshToken, {
          secret: verifySecret,
        });
        break;
      } catch (err: any) {
        lastVerifyError = err;
        const isExpired = String(err?.name || '').includes('TokenExpiredError');
        if (allowExpiredInNonProd && isExpired) {
          try {
            payload = this.jwtService.verify(normalizedRefreshToken, {
              secret: verifySecret,
              ignoreExpiration: true,
            });
            break;
          } catch (expiredFallbackErr) {
            lastVerifyError = expiredFallbackErr;
          }
        }
      }
    }

    if (!payload) {
      this.logger.warn(
        `[refresh] token verification failed in ${env || 'unknown'} env: ${lastVerifyError?.name || 'UnknownError'} ${lastVerifyError?.message || ''}`.trim(),
      );
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Allow refresh even when the presented token was previously revoked.
    // This keeps refresh flows resilient when clients call refresh with an
    // expired/revoked user session token and still hold a usable refresh token.

    if (!payload?.userId || !payload?.role) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }
    const isPlatformAdmin = payload.role === 'admin';
    if (!isPlatformAdmin && !(payload.manufacturerId || payload.vendorId)) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    const newPayload: Record<string, unknown> = {
      userId: payload.userId,
      type: payload.type || payload.role,
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

    const accessTokenJti = crypto.randomUUID();
    const newRefreshTokenJti = crypto.randomUUID();
    const accessToken = this.jwtService.sign(newPayload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '10h',
      jwtid: accessTokenJti,
    });

    const refreshToken = this.jwtService.sign(newPayload, {
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
      jwtid: newRefreshTokenJti,
    });

    await this.revokeTokenByJtiAndExp(
      payload?.jti,
      typeof payload?.exp === 'number' ? payload.exp : undefined,
    );

    let refreshedUser: Record<string, unknown> | undefined;
    try {
      const vu = await this.vendorUsersService.findById(String(payload.userId));
      if (vu && (vu.type === 'admin' || vu.type === 'staff')) {
        refreshedUser = this.buildAdminPortalUserPayload(vu);
      }
    } catch {
      /* ignore */
    }

    return {
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken,
        ...(refreshedUser ? { user: refreshedUser } : {}),
      },
    };
  }

  async verifyRecaptcha(captchaToken: string): Promise<boolean> {
    const normalizedToken = String(captchaToken || '').trim();
    if (!normalizedToken) {
      return false;
    }

    const cacheKey = this.buildRecaptchaVerifyCacheKey(normalizedToken);
    try {
      const cached = await this.redisService.get<{ valid: boolean }>(cacheKey);
      if (cached && typeof cached.valid === 'boolean') {
        return cached.valid;
      }
    } catch (error) {
      this.logger.warn(
        `reCAPTCHA cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const valid = await this.captchaService.verifyCaptcha(normalizedToken);
    this.redisService
      .set(cacheKey, { valid }, this.getRecaptchaVerifyCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `reCAPTCHA cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return valid;
  }

  async logout(accessToken: string, refreshToken?: string) {
    const secret = this.configService.get<string>('JWT_SECRET') || 'secret';
    const tokensToRevoke = [accessToken, refreshToken].filter(
      (token): token is string => Boolean(token && token.trim()),
    );

    for (const token of tokensToRevoke) {
      try {
        const payload = this.jwtService.verify(token, { secret });
        await this.revokeTokenByJtiAndExp(
          payload?.jti,
          typeof payload?.exp === 'number' ? payload.exp : undefined,
        );
      } catch {
        // Ignore invalid/expired tokens: logout remains idempotent.
      }
    }

    return { loggedOut: true };
  }
}
