const ZERO_DATE_PREFIX = '0000-00-00';
const EPOCH_FALLBACK = new Date('1970-01-01T00:00:00.000Z');

export function parseMysqlDate(value: unknown): Date | null | undefined {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return value;
  }
  const str = String(value).trim();
  if (!str || str.startsWith(ZERO_DATE_PREFIX)) {
    return null;
  }
  const d = new Date(str.includes('T') ? str : str.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  return d;
}

export function parseMysqlDateRequired(value: unknown): Date {
  return parseMysqlDate(value) ?? EPOCH_FALLBACK;
}

export function normalizeUrn(value: unknown): string {
  return String(value ?? '').trim();
}

export function normalizeEmail(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

export function trimString(value: unknown): string {
  return String(value ?? '').trim();
}

export function parseDecimalNumber(value: unknown): number {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function parseJsonArray(value: unknown): unknown {
  if (value === null || value === undefined || value === '') return null;
  if (Array.isArray(value)) return value;
  const str = String(value).trim();
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    if (str.includes(',')) {
      return str.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return str;
  }
}
