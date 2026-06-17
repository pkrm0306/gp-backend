import { BadRequestException } from '@nestjs/common';
import {
  normalizeDialCode,
  normalizePhoneWithCountryCode,
} from '../../common/utils/normalize-phone-with-country-code.util';

export type PartnerPhoneFields = {
  phone?: string;
  mobile?: string;
  countryCode?: string;
  country_code?: string;
  dialCode?: string;
  dial_code?: string;
};

export function resolvePartnerCountryCode(
  dto: PartnerPhoneFields,
): string | undefined {
  const normalized = normalizeDialCode(
    dto.countryCode ?? dto.country_code ?? dto.dialCode ?? dto.dial_code,
  );
  return normalized || undefined;
}

export function resolvePartnerPhone(dto: PartnerPhoneFields): string {
  const raw = String(dto.phone ?? dto.mobile ?? '').trim();
  if (!raw) {
    throw new BadRequestException('Phone / mobile is required');
  }

  const countryCode = resolvePartnerCountryCode(dto);
  const isLocal = !raw.startsWith('+');

  try {
    return normalizePhoneWithCountryCode(raw, countryCode, {
      requireCountryCodeForLocal: isLocal,
    });
  } catch (error) {
    throw new BadRequestException((error as Error).message || 'Invalid phone');
  }
}
