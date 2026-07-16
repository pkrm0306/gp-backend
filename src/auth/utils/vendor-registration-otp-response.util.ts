import { ConfigService } from '@nestjs/config';
import {
  isDisposableEmailDomain,
  yopmailInboxHint,
} from '../../common/utils/disposable-email.util';

export type VendorRegistrationOtpClientPayload = {
  verificationOtp?: string;
  otp?: string;
  emailDeliveryNote?: string;
  yopmailInboxHint?: string;
};

function isNonProductionEnv(configService: ConfigService): boolean {
  const nodeEnv = String(
    configService.get<string>('NODE_ENV') ||
      configService.get<string>('APP_ENV') ||
      configService.get<string>('ENV') ||
      '',
  )
    .trim()
    .toLowerCase();
  return (
    nodeEnv === 'staging' ||
    nodeEnv === 'development' ||
    nodeEnv === 'test' ||
    nodeEnv === 'local'
  );
}

/** When true, API may return OTP in the response (staging or disposable inbox). */
export function shouldExposeVendorOtpInResponse(
  configService: ConfigService,
  email: string,
): boolean {
  return isNonProductionEnv(configService) || isDisposableEmailDomain(email);
}

export function buildVendorRegistrationOtpClientPayload(
  configService: ConfigService,
  email: string,
  otp: string,
): VendorRegistrationOtpClientPayload {
  if (!shouldExposeVendorOtpInResponse(configService, email)) {
    return {};
  }

  const disposable = isDisposableEmailDomain(email);
  const yopHint = yopmailInboxHint(email);

  let emailDeliveryNote: string | undefined;
  if (disposable) {
    emailDeliveryNote =
      'Temporary inboxes (Yopmail, etc.) often do not show emails sent from Gmail SMTP. Use verificationOtp below on the verify screen.';
  } else if (isNonProductionEnv(configService)) {
    emailDeliveryNote =
      'Staging/dev: if the inbox email is delayed, use verificationOtp below.';
  }

  return {
    verificationOtp: otp,
    otp,
    ...(emailDeliveryNote ? { emailDeliveryNote } : {}),
    ...(yopHint ? { yopmailInboxHint: yopHint } : {}),
  };
}

export function buildVendorRegistrationSuccessMessage(
  configService: ConfigService,
  email: string,
  otp: string,
  emailDelivered: boolean,
): string {
  const expose = shouldExposeVendorOtpInResponse(configService, email);
  if (!emailDelivered) {
    return expose
      ? `Registration successful, but email could not be sent. Your verification code is ${otp}.`
      : 'Registration successful, but the verification email could not be sent. Please use Resend OTP.';
  }
  if (expose) {
    if (isDisposableEmailDomain(email)) {
      return `Registration successful. Your verification code is ${otp}. Yopmail/temporary inboxes may not receive Gmail mail — use this code to verify.`;
    }
    return `Registration successful. Your verification code is ${otp}. Check your email or use this code if mail is delayed.`;
  }
  return 'Registration successful. Please verify your email.';
}

export function buildVendorResendOtpMessage(
  configService: ConfigService,
  email: string,
  otp: string,
): string {
  if (shouldExposeVendorOtpInResponse(configService, email)) {
    if (isDisposableEmailDomain(email)) {
      return `Verification code is ${otp}. Yopmail/temporary inboxes may not receive Gmail mail — use this code to verify.`;
    }
    return `Verification code is ${otp}. Check your email or use this code if mail is delayed.`;
  }
  return 'Verification OTP sent to your email.';
}
