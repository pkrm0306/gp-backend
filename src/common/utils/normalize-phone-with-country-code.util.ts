/** Normalize dial code to E.164 prefix (e.g. `91` or `+91` → `+91`). */
export function normalizeDialCode(raw: unknown): string {
  const digits = String(raw ?? '')
    .trim()
    .replace(/[^\d]/g, '');
  return digits ? `+${digits}` : '';
}

export type NormalizePhoneWithCountryCodeOptions = {
  /** When true, local digits without `+` require a dial code. */
  requireCountryCodeForLocal?: boolean;
  minDigits?: number;
  maxDigits?: number;
};

/**
 * Combine local phone digits with a country dial code, or pass through international `+` numbers.
 */
export function normalizePhoneWithCountryCode(
  phoneRaw: unknown,
  countryCodeRaw?: unknown,
  options: NormalizePhoneWithCountryCodeOptions = {},
): string {
  const minDigits = options.minDigits ?? 7;
  const maxDigits = options.maxDigits ?? 15;

  const phoneInput = String(phoneRaw ?? '').trim();
  if (!phoneInput) {
    throw new Error('Phone is required');
  }

  const countryCodeInput = String(countryCodeRaw ?? '').trim();
  const sanitizedPhone = phoneInput.replace(/[^\d+]/g, '');
  const normalizedDialCode = normalizeDialCode(countryCodeInput);

  let normalizedPhone: string;
  if (sanitizedPhone.startsWith('+')) {
    normalizedPhone = `+${sanitizedPhone.slice(1).replace(/[^\d]/g, '')}`;
  } else {
    const digits = sanitizedPhone.replace(/[^\d]/g, '');
    if (!normalizedDialCode && options.requireCountryCodeForLocal) {
      throw new Error('countryCode is required for local phone numbers');
    }
    normalizedPhone = normalizedDialCode
      ? `${normalizedDialCode}${digits}`
      : digits;
  }

  const digitCount = normalizedPhone.replace(/[^\d]/g, '').length;
  if (digitCount < minDigits || digitCount > maxDigits) {
    throw new Error('Phone number is invalid');
  }

  return normalizedPhone;
}

export type ManufacturerInquiryPhoneFields = {
  phoneNumber?: string;
  phone?: string;
  contact?: string;
  countryCode?: string;
  country_code?: string;
  dialCode?: string;
  dial_code?: string;
};

/** Resolve raw inquiry body fields to one E.164-style phone string. */
export function resolveManufacturerInquiryPhone(
  dto: ManufacturerInquiryPhoneFields,
): string {
  const raw = String(
    dto.phoneNumber ?? dto.phone ?? dto.contact ?? '',
  ).trim();
  const countryCode =
    dto.countryCode ?? dto.country_code ?? dto.dialCode ?? dto.dial_code;
  const isLocal = raw.length > 0 && !raw.startsWith('+');
  return normalizePhoneWithCountryCode(raw, countryCode, {
    requireCountryCodeForLocal: isLocal,
  });
}
