import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/** Thrown when Google's siteverify API cannot be reached. */
export class RecaptchaUnreachableError extends Error {
  constructor(
    message = 'Unable to reach Google reCAPTCHA verification service',
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'RecaptchaUnreachableError';
  }
}

type GoogleSiteVerifyResponse = {
  success?: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
};

/**
 * Google reCAPTCHA v2 server-side verification.
 * Call {@link assertRecaptchaToken} at the start of protected handlers
 * before any business logic.
 */
@Injectable()
export class RecaptchaService {
  private readonly logger = new Logger(RecaptchaService.name);
  private readonly verifyUrl =
    'https://www.google.com/recaptcha/api/siteverify';

  constructor(private readonly configService: ConfigService) {}

  private getSecretKey(): string {
    const secret = String(
      this.configService.get<string>('RECAPTCHA_SECRET_KEY') ?? '',
    ).trim();
    if (!secret) {
      throw new Error(
        'RECAPTCHA_SECRET_KEY is missing. Set it in the backend environment.',
      );
    }
    return secret;
  }

  /**
   * Verify a reCAPTCHA v2 token with Google.
   * @returns `true` only when Google's `success` is true
   * @throws if `RECAPTCHA_SECRET_KEY` is missing
   * @throws {@link RecaptchaUnreachableError} if Google cannot be reached
   */
  async verifyRecaptcha(token: string): Promise<boolean> {
    const secret = this.getSecretKey();
    const normalizedToken = String(token ?? '').trim();
    if (!normalizedToken) {
      return false;
    }

    try {
      const form = new URLSearchParams();
      form.set('secret', secret);
      form.set('response', normalizedToken);

      const response = await axios.post<GoogleSiteVerifyResponse>(
        this.verifyUrl,
        form.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        },
      );

      const success = response.data?.success === true;
      if (!success) {
        const errorCodes = Array.isArray(response.data?.['error-codes'])
          ? response.data['error-codes'].join(', ')
          : 'unknown';
        this.logger.warn(
          `reCAPTCHA siteverify failed (error-codes: ${errorCodes})`,
        );
      }
      return success;
    } catch (error) {
      if (error instanceof Error && error.message.includes('RECAPTCHA_SECRET_KEY')) {
        throw error;
      }
      this.logger.error(
        `reCAPTCHA siteverify unreachable: ${(error as Error)?.message || error}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new RecaptchaUnreachableError(undefined, error);
    }
  }

  /**
   * Enforce reCAPTCHA on a protected request.
   * - missing token → HTTP 400
   * - Google success:false → HTTP 403
   * - Google unreachable / misconfigured → HTTP 500
   */
  async assertRecaptchaToken(token: unknown): Promise<void> {
    const normalized = String(token ?? '').trim();
    if (!normalized) {
      throw new BadRequestException({
        message: 'reCAPTCHA token is required.',
      });
    }

    // Server-side Google verification before any business logic.
    try {
      const valid = await this.verifyRecaptcha(normalized);
      if (!valid) {
        throw new ForbiddenException({
          message: 'reCAPTCHA verification failed.',
        });
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      if (error instanceof RecaptchaUnreachableError) {
        throw new InternalServerErrorException({
          message: 'Unable to verify reCAPTCHA. Please try again later.',
        });
      }
      if (
        error instanceof Error &&
        error.message.includes('RECAPTCHA_SECRET_KEY')
      ) {
        this.logger.error(error.message);
        throw new InternalServerErrorException({
          message: 'Unable to verify reCAPTCHA. Please try again later.',
        });
      }
      this.logger.error(
        `Unexpected reCAPTCHA error: ${(error as Error)?.message || error}`,
      );
      throw new InternalServerErrorException({
        message: 'Unable to verify reCAPTCHA. Please try again later.',
      });
    }
  }
}

/** Prefer `recaptchaToken`; accept legacy aliases from older clients. */
export function pickRecaptchaToken(
  source: Record<string, unknown> | null | undefined,
): string {
  if (!source || typeof source !== 'object') {
    return '';
  }
  for (const key of [
    'recaptchaToken',
    'captchaToken',
    'gRecaptchaResponse',
    'g-recaptcha-response',
    'recaptcha_response',
  ]) {
    const value = String(source[key] ?? '').trim();
    if (value) {
      return value;
    }
  }
  return '';
}
