import {
  resolvePartnerCountryCode,
  resolvePartnerPhone,
} from './partner-phone.util';

describe('partner-phone.util', () => {
  it('combines country code with local mobile', () => {
    expect(
      resolvePartnerPhone({
        mobile: '9848441332',
        countryCode: '+91',
      }),
    ).toBe('+919848441332');
  });

  it('passes through international phone', () => {
    expect(
      resolvePartnerPhone({
        phone: '+14155552671',
      }),
    ).toBe('+14155552671');
  });

  it('requires country code for local digits', () => {
    expect(() =>
      resolvePartnerPhone({
        mobile: '9848441332',
      }),
    ).toThrow('countryCode is required for local phone numbers');
  });

  it('normalizes dial code aliases', () => {
    expect(
      resolvePartnerCountryCode({ country_code: '91' }),
    ).toBe('+91');
  });
});
