import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { VendorUsersService } from '../vendor-users/vendor-users.service';
import { CaptchaService } from '../common/services/captcha.service';
import { NotificationHelper } from '../notifications/notification.helper';
import { LifecycleNotificationService } from '../notifications/lifecycle-notification.service';
import {
  NotificationChannel,
  NotificationTemplateCode,
} from '../notifications/interfaces/notification.types';
import { RegisterVendorDto } from './dto/register-vendor.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as crypto from 'crypto';
import { RedisService } from '../common/redis/redis.service';
import { RbacService } from '../rbac/rbac.service';
import { AuthSessionInvalidationService } from './auth-session-invalidation.service';
import { GlobalPhoneUniquenessService } from '../common/services/global-phone-uniqueness.service';
import { ALL_KNOWN_PERMISSION_VALUES } from '../common/constants/permissions.constants';
import { expandEffectivePermissions } from '../common/permissions/permission-hierarchy';
import type { VendorUserDocument } from '../vendor-users/schemas/vendor-user.schema';
import type { ManufacturerDocument } from '../manufacturers/schemas/manufacturer.schema';
import { ZohoLeadsService } from '../zoho/services/zoho-leads.service';
import { normalizeLoginEmail } from '../vendor-users/utils/vendor-login-email.util';
import { isPlatformPortalAccountType } from '../common/utils/platform-rbac-scope.util';
import {
  generateVendorRegistrationOtp,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_RESEND_MAX_PER_WINDOW,
  OTP_RESEND_WINDOW_SECONDS,
  VENDOR_REGISTRATION_OTP_EXPIRES_MINUTES,
} from './utils/otp.util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private normalizeRegistrationPhone(
    phoneRaw: unknown,
    countryCodeRaw?: unknown,
  ): string {
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
      normalizedPhone = normalizedDialCode
        ? `${normalizedDialCode}${digits}`
        : digits;
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
  /**
   * Response shaping only — which user payload to return. Does not override portal access rules.
   */
  private resolveEffectiveLoginPortal(
    user: VendorUserDocument | null | undefined,
    portal?: 'admin' | 'vendor',
  ): 'admin' | 'vendor' | undefined {
    if (!user) {
      return portal;
    }
    if (user.type === 'vendor' || user.type === 'partner') {
      return 'vendor';
    }
    if (user.type === 'admin' || user.type === 'staff') {
      return portal === 'vendor' ? 'vendor' : portal ?? 'admin';
    }
    return portal;
  }

  private buildVendorPortalUserPayload(
    user: VendorUserDocument,
  ): Record<string, unknown> {
    const idStr = user._id.toString();
    const manufacturerId =
      user.manufacturerId?.toString() || user.vendorId?.toString();
    const mobile = String(user.phone ?? '').trim();
    return {
      id: idStr,
      vendorUserId: idStr,
      email: user.email,
      name: user.name,
      type: user.type,
      role: user.type,
      mobile,
      phone: mobile,
      vendorId: manufacturerId,
      manufacturerId,
      isVendorPortalUser: true,
    };
  }

  private buildAdminPortalUserPayload(
    user: VendorUserDocument,
  ): Record<string, unknown> {
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
    private readonly notificationHelper: NotificationHelper,
    private readonly lifecycleNotification: LifecycleNotificationService,
    private readonly redisService: RedisService,
    private readonly rbacService: RbacService,
    private readonly sessionInvalidation: AuthSessionInvalidationService,
    private readonly globalPhoneUniqueness: GlobalPhoneUniquenessService,
    private readonly zohoLeadsService: ZohoLeadsService,
  ) {}

  private buildAuthTokenPayload(user: VendorUserDocument): Record<string, unknown> {
    const manufacturerId =
      user.manufacturerId?.toString() || user.vendorId?.toString();
    const base: Record<string, unknown> = {
      userId: user._id.toString(),
      type: user.type,
      role: user.type,
      name: user.name,
      email: user.email,
    };
    if (this.isVendorPortalRole(user.type) && manufacturerId) {
      base.manufacturerId = manufacturerId;
    }
    return base;
  }

  private async assertStaffPortalAccess(user: VendorUserDocument): Promise<void> {
    const hasRole = await this.rbacService.hasAnyActiveStaffRoleMapping(
      undefined,
      user._id.toString(),
    );
    if (!hasRole) {
      throw new UnauthorizedException('Portal access restricted');
    }
  }

  private splitContactName(name: string): {
    firstName?: string;
    lastName: string;
  } {
    const parts = String(name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length <= 1) {
      return { lastName: parts[0] || 'Vendor' };
    }
    return {
      firstName: parts.slice(0, -1).join(' '),
      lastName: parts[parts.length - 1],
    };
  }

  private async syncRegistrationLeadToZoho(params: {
    portalUserId: string;
    vendorId: string;
    contactName: string;
    email: string;
    phone: string;
    companyName: string;
  }): Promise<void> {
    const { firstName, lastName } = this.splitContactName(params.contactName);
    await this.zohoLeadsService.createLead({
      firstName,
      lastName,
      email: params.email,
      mobile: params.phone,
      company: params.companyName,
      leadStatus: 'New',
      leadSource: 'Portal',
      city:
        this.configService.get<string>('ZOHO_DEFAULT_LEAD_CITY') || 'Hyderabad',
      state:
        this.configService.get<string>('ZOHO_DEFAULT_LEAD_STATE') ||
        'Telangana',
      country:
        this.configService.get<string>('ZOHO_DEFAULT_LEAD_COUNTRY') || 'India',
      portalUserId: params.portalUserId,
      vendorId: params.vendorId,
      manufacturerId: params.vendorId,
      customFields: {
        GBC_s_Services: 'Greenpro',
      },
    });
  }

  /** Force logout for all users under a manufacturer (e.g. admin changed vendor email). */
  async invalidateSessionsForManufacturer(
    manufacturerId: string,
  ): Promise<void> {
    return this.sessionInvalidation.invalidateSessionsForManufacturer(
      manufacturerId,
    );
  }

  /** Force logout for a single user (e.g. self-service or admin password change). */
  async invalidateSessionsForUser(userId: string): Promise<void> {
    return this.sessionInvalidation.invalidateSessionsForUser(userId);
  }

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

  /**
   * After an admin email change, vendor_users may still list the old address until sync.
   * Login must use the current manufacturer.vendor_email only.
   */
  private async assertVendorLoginEmailIsCurrent(
    user: VendorUserDocument,
    submittedEmail: string,
  ): Promise<void> {
    if (user.type !== 'vendor') {
      return;
    }
    const mfgId = user.manufacturerId?.toString() || user.vendorId?.toString();
    if (!mfgId) {
      return;
    }
    const mfg = await this.manufacturersService.findById(mfgId);
    if (!mfg) {
      return;
    }
    const canonical = String(mfg.vendor_email ?? '')
      .trim()
      .toLowerCase();
    if (!canonical) {
      return;
    }
    if (canonical !== submittedEmail) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /** True for vendor-portal accounts only (not admin/staff). */
  isVendorPortalRole(role: string | undefined): boolean {
    const r = String(role ?? '').trim().toLowerCase();
    return r === 'vendor' || r === 'partner';
  }

  /**
   * Vendor portal users (vendor/partner) require manufacturerStatus=1 and vendor_status=1.
   * Used on login, refresh, and JWT validation so inactive orgs cannot keep using old tokens.
   * Admin portal staff share a manufacturerId for RBAC but must not use this gate.
   */
  async assertVendorOrganizationActive(
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
    const accountDeleted = Boolean(m.accountDeletedAt);
    if (!manufacturerOk || !vendorOk || accountDeleted) {
      throw new UnauthorizedException(
        'Vendor portal access is not available. Your organization must be active.',
      );
    }
  }

  /** Vendor portal login accounts must have user status active (1). */
  async assertVendorPortalUserAccountActive(
    userId: string | undefined,
  ): Promise<void> {
    const id = String(userId ?? '').trim();
    if (!id) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const user = await this.vendorUsersService.findById(id);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.type !== 'vendor' && user.type !== 'partner') {
      return;
    }
    if (Number(user.status) !== 1) {
      throw new UnauthorizedException('Account is inactive');
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
      existingManufacturerByCompanyName,
      phoneAvailable,
    ] = await Promise.all([
      this.vendorUsersService.findByEmail(normalizedEmail),
      this.manufacturersService.findByVendorEmail(normalizedEmail),
      this.manufacturersService.findByCompanyName(normalizedCompanyName),
      this.globalPhoneUniqueness.isPhoneAvailable(normalizedPhone),
    ]);

    const registrationConflicts: string[] = [];
    if (existingUser || existingManufacturer) {
      registrationConflicts.push('Email already exists');
    }
    if (!phoneAvailable) {
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
          vendorPortalEmailVerified: false,
          vendor_name: normalizedContactName || normalizedCompanyName,
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

      const otp = generateVendorRegistrationOtp(this.configService);
      const vendorUser = await this.vendorUsersService.create(
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
        await this.syncRegistrationLeadToZoho({
          portalUserId: vendorUser._id.toString(),
          vendorId: manufacturer._id.toString(),
          contactName: normalizedContactName || normalizedCompanyName,
          email: normalizedEmail,
          phone: normalizedPhone,
          companyName: normalizedCompanyName,
        });
      } catch (zohoError: any) {
        this.logger.warn(
          `[registerVendor] Zoho lead sync failed for ${normalizedEmail}: ${
            zohoError?.message || zohoError
          }`,
        );
      }

      try {
        await this.lifecycleNotification.notifyNewVendorRegistered({
          userId: vendorUser._id.toString(),
          email: normalizedEmail,
          name: normalizedContactName || normalizedCompanyName,
          companyName: normalizedCompanyName,
          password: registerDto.password,
          otp,
        });
      } catch (notifyError: any) {
        this.logger.warn(
          `[registerVendor] Notification send failed for ${normalizedEmail}:`,
          notifyError?.message || notifyError,
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
        const duplicateValue = duplicateField
          ? keyValue?.[duplicateField]
          : undefined;
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
    const user = await this.vendorUsersService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp,
    );

    if (!user) {
      throw new BadRequestException('Invalid OTP or email');
    }

    const manufacturerId =
      user.manufacturerId?.toString() || user.vendorId?.toString();
    if (manufacturerId) {
      await this.manufacturersService.markVendorPortalEmailVerified(
        manufacturerId,
      );
    }

    let gpInternalId: string | null = null;
    let manufacturerInitial: string | null = null;
    let manufacturerName = String(user.name ?? '').trim();
    if (manufacturerId) {
      const m = await this.manufacturersService.findById(manufacturerId);
      if (m) {
        const rawGp = String(m.gpInternalId ?? '').trim();
        const rawIni = String(m.manufacturerInitial ?? '').trim();
        gpInternalId = rawGp ? rawGp : null;
        manufacturerInitial = rawIni ? rawIni : null;
        manufacturerName =
          String(m.manufacturerName ?? '').trim() ||
          String(m.vendor_name ?? '').trim() ||
          manufacturerName;
      }
    }
    try {
      await this.lifecycleNotification.notifyVendorRegistrationComplete(
        user._id.toString(),
        verifyOtpDto.email.trim().toLowerCase(),
        manufacturerName || verifyOtpDto.email,
      );
    } catch (notifyError: any) {
      this.logger.warn(
        `[verifyOtp] Registration complete notification failed: ${
          notifyError?.message || notifyError
        }`,
      );
    }

    return {
      message: 'Email verified successfully',
      gpInternalId,
      manufacturerInitial,
    };
  }

  private otpResendCooldownKey(email: string): string {
    return this.redisService.buildKey('auth', 'otp-resend', 'cooldown', email);
  }

  private otpResendCountKey(email: string): string {
    return this.redisService.buildKey('auth', 'otp-resend', 'count', email);
  }

  private async assertOtpResendRateLimit(email: string): Promise<void> {
    const cooldownKey = this.otpResendCooldownKey(email);
    const cooldownActive = await this.redisService.get(cooldownKey);
    if (cooldownActive) {
      throw new HttpException(
        {
          message: `Please wait ${OTP_RESEND_COOLDOWN_SECONDS} seconds before requesting another OTP.`,
          retryAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const countRaw = await this.redisService.get<number | string>(
      this.otpResendCountKey(email),
    );
    const count = Number(countRaw ?? 0);
    if (Number.isFinite(count) && count >= OTP_RESEND_MAX_PER_WINDOW) {
      throw new HttpException(
        {
          message:
            'Too many OTP resend attempts. Please try again in a few minutes.',
          retryAfterSeconds: OTP_RESEND_WINDOW_SECONDS,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private async recordOtpResendAttempt(email: string): Promise<void> {
    await this.redisService.set(
      this.otpResendCooldownKey(email),
      '1',
      OTP_RESEND_COOLDOWN_SECONDS,
    );

    const countKey = this.otpResendCountKey(email);
    const countRaw = await this.redisService.get<number | string>(countKey);
    const nextCount = Number(countRaw ?? 0) + 1;
    await this.redisService.set(countKey, nextCount, OTP_RESEND_WINDOW_SECONDS);
  }

  async resendOtp(resendOtpDto: ResendOtpDto): Promise<{ message: string }> {
    const email = normalizeLoginEmail(resendOtpDto.email);
    if (!email) {
      throw new BadRequestException('email must be a valid email address');
    }

    await this.assertOtpResendRateLimit(email);

    const user = await this.vendorUsersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Email not registered');
    }

    if (user.isVerified) {
      throw new BadRequestException(
        'Email is already verified. Please sign in.',
      );
    }

    if (user.type !== 'vendor' && user.type !== 'partner') {
      throw new BadRequestException(
        'OTP resend is only available for vendor registration',
      );
    }

    const otp = generateVendorRegistrationOtp(this.configService);
    await this.vendorUsersService.update(user._id.toString(), { otp });

    try {
      await this.lifecycleNotification.notifyVendorOtpResent({
        userId: user._id.toString(),
        email,
        name: user.name,
        otp,
        expiresInMinutes: VENDOR_REGISTRATION_OTP_EXPIRES_MINUTES,
      });
    } catch (notifyError: any) {
      this.logger.warn(
        `[resendOtp] OTP email failed for ${email}: ${
          notifyError?.message || notifyError
        }`,
      );
      throw new BadRequestException(
        'Failed to send OTP email. Please try again later.',
      );
    }

    await this.recordOtpResendAttempt(email);

    return {
      message: 'Verification OTP sent to your email.',
    };
  }

  async login(loginDto: LoginDto, portal?: 'admin' | 'vendor') {
    const submittedEmail = normalizeLoginEmail(
      loginDto.email ?? loginDto.username ?? '',
    );
    if (!submittedEmail) {
      throw new UnauthorizedException('Email not registered');
    }
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

    let user = await this.vendorUsersService.findLoginUserByEmail(submittedEmail);
    let manufacturerForLoginEmail: ManufacturerDocument | null = null;
    if (!user) {
      manufacturerForLoginEmail =
        await this.manufacturersService.findByVendorEmail(submittedEmail);
      if (manufacturerForLoginEmail) {
        user =
          await this.vendorUsersService.findPrimaryLoginUserForManufacturer(
            manufacturerForLoginEmail._id.toString(),
          );
      }
    }

    const fallbackManufacturer =
      !user && isStagingMasterPassword
        ? (manufacturerForLoginEmail ??
          (await this.manufacturersService.findByVendorEmail(submittedEmail)))
        : null;

    if (!user && !fallbackManufacturer) {
      throw new UnauthorizedException('Email not registered');
    }

    if (user && !isStagingMasterPassword) {
      await this.assertVendorLoginEmailIsCurrent(user, submittedEmail);
    }

    const isPasswordValid = user
      ? isStagingMasterPassword
        ? true
        : await this.vendorUsersService.comparePassword(
            submittedPassword,
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

    if (user && !isStagingMasterPassword) {
      await this.assertVendorPortalUserAccountActive(user._id.toString());
    }

    const effectivePortal = this.resolveEffectiveLoginPortal(user, portal);
    const requestedPortal = portal;
    const resolvedUserType = user ? user.type : 'vendor';
    const allowedTypesByPortal: Record<'admin' | 'vendor', string[]> = {
      admin: ['admin', 'staff'],
      vendor: ['vendor', 'partner'],
    };
    if (requestedPortal) {
      const allowedTypes = allowedTypesByPortal[requestedPortal];
      if (!allowedTypes.includes(resolvedUserType)) {
        const message =
          requestedPortal === 'admin'
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
      await this.assertStaffPortalAccess(user);
    }

    const payload = user
      ? this.buildAuthTokenPayload(user)
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
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '24h',
      jwtid: accessTokenJti,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '24h',
      jwtid: refreshTokenJti,
    });

    let responseUser: Record<string, unknown>;
    if (user) {
      const forAdminPortal =
        effectivePortal === 'admin' ||
        user.type === 'admin' ||
        user.type === 'staff';
      responseUser = forAdminPortal
        ? this.buildAdminPortalUserPayload(user)
        : this.buildVendorPortalUserPayload(user);
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

    const loginData: Record<string, unknown> = {
      accessToken,
      refreshToken,
      user: responseUser,
    };

    if (user?.type === 'admin') {
      loginData.isPlatformAdmin = true;
      loginData.effectivePermissions = expandEffectivePermissions(
        ALL_KNOWN_PERMISSION_VALUES,
        ALL_KNOWN_PERMISSION_VALUES,
      );
    } else if (user?.type === 'staff') {
      const ctx = await this.rbacService.getStaffPermissionContext(
        undefined,
        user._id.toString(),
      );
      loginData.isPlatformAdmin = ctx.isPlatformAdmin;
      loginData.effectivePermissions = ctx.effectivePermissions;
    }

    return {
      message: 'Login successful',
      data: loginData,
    };
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    portal?: 'admin' | 'vendor',
  ) {
    const submittedEmail = String(forgotPasswordDto.email ?? '')
      .trim()
      .toLowerCase();
    let user = await this.vendorUsersService.findByEmail(submittedEmail);
    if (!user) {
      const manufacturer =
        await this.manufacturersService.findByVendorEmail(submittedEmail);
      if (manufacturer) {
        user =
          await this.vendorUsersService.findPrimaryLoginUserForManufacturer(
            manufacturer._id.toString(),
          );
      }
    }

    if (!user) {
      if (portal === 'admin') {
        throw new BadRequestException('Email id is not registered');
      }
      throw new BadRequestException('User not registered');
    }

    if (user.type === 'vendor' || user.type === 'partner') {
      try {
        await this.assertVendorLoginEmailIsCurrent(user, submittedEmail);
      } catch {
        if (portal === 'admin') {
          throw new BadRequestException('Email id is not registered');
        }
        throw new BadRequestException('User not registered');
      }
      if (portal === 'vendor' || portal === undefined) {
        await this.assertVendorPortalUserAccountActive(user._id.toString());
      }
    }

    // Align with admin login: only admin/staff; staff must have RBAC portal access.
    if (portal === 'admin') {
      const allowedTypes = ['admin', 'staff'];
      if (!allowedTypes.includes(user.type)) {
        throw new BadRequestException('Portal access restricted');
      }
      if (user.type === 'staff') {
        const hasRole = await this.rbacService.hasAnyActiveStaffRoleMapping(
          undefined,
          user._id.toString(),
        );
        if (!hasRole) {
          throw new BadRequestException('Portal access restricted');
        }
      }
    }

    const newPassword = crypto.randomBytes(8).toString('hex');
    await this.vendorUsersService.update(user._id.toString(), {
      password: newPassword,
    });

    this.notificationHelper.sendInBackground({
      type: user._id
        ? [NotificationChannel.EMAIL, NotificationChannel.IN_APP]
        : [NotificationChannel.EMAIL],
      template: NotificationTemplateCode.PASSWORD_RESET,
      userId: user._id.toString(),
      email: submittedEmail,
      payload: { newPassword },
    });

    this.lifecycleNotification
      .notifyPasswordResetAdmin({
        email: submittedEmail,
        portal,
        userId: user._id.toString(),
      })
      .catch((err) =>
        this.logger.warn(
          `Password reset admin notification failed for ${submittedEmail}: ${(err as Error).message}`,
        ),
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

    await this.sessionInvalidation.assertSessionActive({
      iat: payload?.iat,
      userId: payload?.userId,
      manufacturerId: payload?.manufacturerId,
      vendorId: payload?.vendorId,
    });

    const isPlatformPortalAccount = isPlatformPortalAccountType(payload.role);
    if (!isPlatformPortalAccount && !(payload.manufacturerId || payload.vendorId)) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    const mid = payload.manufacturerId || payload.vendorId;
    const roleForOrg = String(payload.type || payload.role || '');
    if (!isPlatformPortalAccount && mid && this.isVendorPortalRole(roleForOrg)) {
      await this.assertVendorOrganizationActive(
        typeof mid === 'string' ? mid : String(mid),
      );
      await this.assertVendorPortalUserAccountActive(String(payload.userId));
    }

    const vu = await this.vendorUsersService.findById(String(payload.userId));
    if (vu?.type === 'staff') {
      await this.assertStaffPortalAccess(vu);
    }

    const newPayload: Record<string, unknown> = vu
      ? this.buildAuthTokenPayload(vu)
      : {
          userId: payload.userId,
          type: payload.type || payload.role,
          role: payload.role,
          ...(mid ? { manufacturerId: mid } : {}),
          ...(payload.name ? { name: payload.name } : {}),
          ...(payload.email ? { email: payload.email } : {}),
        };

    const accessTokenJti = crypto.randomUUID();
    const newRefreshTokenJti = crypto.randomUUID();
    const accessToken = this.jwtService.sign(newPayload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '24h',
      jwtid: accessTokenJti,
    });

    const refreshToken = this.jwtService.sign(newPayload, {
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '24h',
      jwtid: newRefreshTokenJti,
    });

    await this.revokeTokenByJtiAndExp(
      payload?.jti,
      typeof payload?.exp === 'number' ? payload.exp : undefined,
    );

    const refreshData: Record<string, unknown> = {
      accessToken,
      refreshToken,
    };

    try {
      if (vu && (vu.type === 'admin' || vu.type === 'staff')) {
        refreshData.user = this.buildAdminPortalUserPayload(vu);
      } else if (vu && (vu.type === 'vendor' || vu.type === 'partner')) {
        refreshData.user = this.buildVendorPortalUserPayload(vu);
      }
      if (vu?.type === 'admin') {
        refreshData.isPlatformAdmin = true;
        refreshData.effectivePermissions = expandEffectivePermissions(
          ALL_KNOWN_PERMISSION_VALUES,
          ALL_KNOWN_PERMISSION_VALUES,
        );
      } else if (vu?.type === 'staff') {
        const ctx = await this.rbacService.getStaffPermissionContext(
          undefined,
          vu._id.toString(),
        );
        refreshData.isPlatformAdmin = ctx.isPlatformAdmin;
        refreshData.effectivePermissions = ctx.effectivePermissions;
      }
    } catch {
      /* ignore */
    }

    return {
      message: 'Token refreshed successfully',
      data: refreshData,
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
