export const DEFAULT_PAYMENT_CURRENCY = 'INR';

const CURRENCY_FIELD_KEYS = [
  'currency',
  'quoteCurrency',
  'quote_currency',
  'currencyCode',
  'currency_code',
] as const;

/**
 * ISO 4217 code from "USD" or "USD — US Dollar".
 * Returns null when the value is empty or not a 3-letter code.
 */
export function normalizePaymentCurrencyCode(
  value?: unknown,
): string | null {
  const upper = String(value ?? '').trim().toUpperCase();
  if (!upper) return null;
  const match = upper.match(/^([A-Z]{3})(?:\s|$)/);
  return match?.[1] ?? null;
}

/** First non-empty currency alias on a payment row. */
export function readExplicitPaymentCurrency(
  payment?: Record<string, unknown> | null,
): string | null {
  if (!payment) return null;
  for (const key of CURRENCY_FIELD_KEYS) {
    const code = normalizePaymentCurrencyCode(payment[key]);
    if (code) return code;
  }
  return null;
}

/**
 * Currency to return on a payment.
 * Certification rows with no stored currency inherit the registration currency.
 */
export function resolvePaymentCurrencyForResponse(options: {
  payment: Record<string, unknown>;
  registrationCurrency?: string | null;
}): string {
  const explicit = readExplicitPaymentCurrency(options.payment);
  if (explicit) return explicit;

  const paymentType = String(options.payment.paymentType ?? '')
    .trim()
    .toLowerCase();
  if (paymentType === 'certification') {
    const inherited = normalizePaymentCurrencyCode(options.registrationCurrency);
    if (inherited) return inherited;
  }

  return DEFAULT_PAYMENT_CURRENCY;
}

export function registrationCurrencyFromPayments(
  payments: Record<string, unknown>[] | null | undefined,
): string | null {
  if (!Array.isArray(payments)) return null;
  for (const payment of payments) {
    const paymentType = String(payment.paymentType ?? '')
      .trim()
      .toLowerCase();
    if (paymentType !== 'registration') continue;
    const currency = readExplicitPaymentCurrency(payment);
    if (currency) return currency;
  }
  return null;
}
