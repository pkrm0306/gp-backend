/**
 * @deprecated Prefer {@link RecaptchaService} from `./recaptcha.service`.
 * Kept as a compatibility alias for existing AuthModule imports.
 */
export {
  RecaptchaService as CaptchaService,
  RecaptchaService,
  RecaptchaUnreachableError,
  pickRecaptchaToken,
} from './recaptcha.service';
