/** Read optional reCAPTCHA token from header or body (not required for manufacturer inquiry). */
export function extractOptionalRecaptchaToken(
  headers: Record<string, unknown> | undefined,
  body?: Record<string, unknown> | undefined,
): string {
  const h = headers ?? {};
  const headerRaw =
    h['x-recaptcha-token'] ??
    h['x-recaptcha-token'.toLowerCase()] ??
    h['X-Recaptcha-Token'];
  const fromHeader = String(headerRaw ?? '').trim();
  if (fromHeader) {
    return fromHeader;
  }

  const b = body ?? {};
  for (const key of [
    'captchaToken',
    'recaptchaToken',
    'gRecaptchaResponse',
    'g-recaptcha-response',
    'recaptcha_response',
    'captcha',
  ]) {
    const value = String(b[key] ?? '').trim();
    if (value) {
      return value;
    }
  }
  return '';
}

/**
 * Manufacturer inquiry does not require reCAPTCHA.
 * When a token is sent, it may be verified elsewhere (e.g. POST /auth/verify-recaptcha) but this endpoint never blocks on it.
 */
export function isManufacturerInquiryRecaptchaRequired(): boolean {
  return false;
}
