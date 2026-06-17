import {
  editDistance,
  isLikelyEmailDomainTypo,
  normalizeLoginEmail,
} from './vendor-login-email.util';

describe('vendor-login-email.util', () => {
  it('normalizes login email', () => {
    expect(normalizeLoginEmail('  Vikas184@Gmail.COM ')).toBe(
      'vikas184@gmail.com',
    );
  });

  it('detects common gmail typo domains', () => {
    expect(isLikelyEmailDomainTypo('gmil.com', 'gmail.com')).toBe(true);
    expect(isLikelyEmailDomainTypo('yahoo.com', 'gmail.com')).toBe(false);
  });

  it('allows small edit distance between domains', () => {
    expect(editDistance('gmil.com', 'gmail.com')).toBeLessThanOrEqual(2);
  });
});
