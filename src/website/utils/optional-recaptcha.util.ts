/**
 * Manufacturer inquiry does not use a separate verify endpoint.
 * Token is sent as `recaptchaToken` on the inquiry payload and verified inline.
 */
export function isManufacturerInquiryRecaptchaRequired(): boolean {
  return true;
}

/** Read reCAPTCHA token from header or body (preferred field: recaptchaToken). */
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
    'recaptchaToken',
    'captchaToken',
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
