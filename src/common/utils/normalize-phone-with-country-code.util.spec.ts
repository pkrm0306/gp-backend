import {
  normalizeDialCode,
  normalizePhoneWithCountryCode,
  resolveManufacturerInquiryPhone,
} from './normalize-phone-with-country-code.util';

describe('normalizePhoneWithCountryCode', () => {
  it('prefixes local digits with dial code', () => {
    expect(
      normalizePhoneWithCountryCode('9876543213', '+91', {
        requireCountryCodeForLocal: true,
      }),
    ).toBe('+919876543213');
  });

  it('accepts dial code without plus', () => {
    expect(normalizePhoneWithCountryCode('9876543213', '91')).toBe(
      '+919876543213',
    );
  });

  it('passes through international numbers', () => {
    expect(normalizePhoneWithCountryCode('+14155552671', '')).toBe(
      '+14155552671',
    );
  });

  it('requires country code for local numbers when configured', () => {
    expect(() =>
      normalizePhoneWithCountryCode('9876543213', '', {
        requireCountryCodeForLocal: true,
      }),
    ).toThrow('countryCode is required');
  });
});

describe('resolveManufacturerInquiryPhone', () => {
  it('merges phoneNumber and countryCode', () => {
    expect(
      resolveManufacturerInquiryPhone({
        phoneNumber: '9876543213',
        countryCode: '+91',
      }),
    ).toBe('+919876543213');
  });

  it('reads country_code alias', () => {
    expect(
      resolveManufacturerInquiryPhone({
        phone: '9876543213',
        country_code: '91',
      }),
    ).toBe('+919876543213');
  });
});

describe('normalizeDialCode', () => {
  it('normalizes +91', () => {
    expect(normalizeDialCode('+91')).toBe('+91');
  });
});
