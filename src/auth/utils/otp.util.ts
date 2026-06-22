import { ConfigService } from '@nestjs/config';

export const VENDOR_REGISTRATION_OTP_EXPIRES_MINUTES = 15;

/** Minimum wait between resend requests for the same email. */
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

/** Max resend attempts per email within the rolling window. */
export const OTP_RESEND_MAX_PER_WINDOW = 5;

export const OTP_RESEND_WINDOW_SECONDS = 15 * 60;

export function generateVendorRegistrationOtp(
  configService: ConfigService,
): string {
  const fixed = String(
    configService.get<string>('VENDOR_REGISTRATION_OTP_FIXED') ?? '',
  ).trim();
  if (fixed) {
    return fixed;
  }

  const nodeEnv = String(
    configService.get<string>('NODE_ENV') ||
      configService.get<string>('APP_ENV') ||
      configService.get<string>('ENV') ||
      '',
  )
    .trim()
    .toLowerCase();

  if (nodeEnv === 'staging' || nodeEnv === 'development' || nodeEnv === 'test') {
    return '123456';
  }

  return String(Math.floor(100000 + Math.random() * 900000));
}
