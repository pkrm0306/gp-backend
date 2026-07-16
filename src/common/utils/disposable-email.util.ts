/** Domains that often do not receive mail from personal Gmail SMTP. */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'cool.fr.nf',
  'jetable.fr.nf',
  'courriel.fr.nf',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'guerrillamail.com',
  'guerrillamail.net',
  'sharklasers.com',
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
]);

export function extractEmailDomain(email: string): string | null {
  const normalized = String(email ?? '').trim().toLowerCase();
  const at = normalized.lastIndexOf('@');
  if (at <= 0 || at === normalized.length - 1) {
    return null;
  }
  return normalized.slice(at + 1);
}

export function isDisposableEmailDomain(email: string): boolean {
  const domain = extractEmailDomain(email);
  if (!domain) {
    return false;
  }
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return true;
  }
  return domain.endsWith('.yopmail.com') || domain.endsWith('.yopmail.fr');
}

export function yopmailInboxHint(email: string): string | null {
  const normalized = String(email ?? '').trim().toLowerCase();
  const domain = extractEmailDomain(normalized);
  if (!domain || !domain.includes('yopmail')) {
    return null;
  }
  const local = normalized.split('@')[0];
  return `Open https://yopmail.com and enter inbox name "${local}" (without @yopmail.com).`;
}
