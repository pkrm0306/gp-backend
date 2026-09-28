import {
  normalizePaymentCurrencyCode,
  readExplicitPaymentCurrency,
  registrationCurrencyFromPayments,
  resolvePaymentCurrencyForResponse,
} from './payment-currency.util';

describe('payment-currency.util', () => {
  it('normalizes codes and labelled currency values', () => {
    expect(normalizePaymentCurrencyCode('usd')).toBe('USD');
    expect(normalizePaymentCurrencyCode('AED — UAE Dirham')).toBe('AED');
    expect(normalizePaymentCurrencyCode('')).toBeNull();
    expect(normalizePaymentCurrencyCode('rupees')).toBeNull();
  });

  it('reads the first stored currency alias', () => {
    expect(readExplicitPaymentCurrency({ quoteCurrency: 'EUR' })).toBe('EUR');
    expect(
      readExplicitPaymentCurrency({ currency: 'USD', quoteCurrency: 'INR' }),
    ).toBe('USD');
    expect(readExplicitPaymentCurrency({})).toBeNull();
  });

  it('keeps a non-INR registration currency instead of defaulting to INR', () => {
    expect(
      resolvePaymentCurrencyForResponse({
        payment: { paymentType: 'registration', currency: 'USD' },
      }),
    ).toBe('USD');
  });

  it('defaults certification currency to the registration currency when unset', () => {
    expect(
      resolvePaymentCurrencyForResponse({
        payment: { paymentType: 'certification' },
        registrationCurrency: 'USD',
      }),
    ).toBe('USD');
    expect(
      resolvePaymentCurrencyForResponse({
        payment: { paymentType: 'certification', currency: 'EUR' },
        registrationCurrency: 'USD',
      }),
    ).toBe('EUR');
  });

  it('finds the registration currency among URN payments', () => {
    expect(
      registrationCurrencyFromPayments([
        { paymentType: 'certification', currency: 'INR' },
        { paymentType: 'registration', quoteCurrency: 'GBP' },
      ]),
    ).toBe('GBP');
  });
});
