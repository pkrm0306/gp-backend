import {
  formatAuditDisplayDateTime,
  formatAuditInstant,
  isAuditDateFieldKey,
  resolveAuditQueryRange,
} from './audit-date.util';

describe('audit-date.util', () => {
  it('formats Date instances as ISO UTC strings', () => {
    expect(formatAuditInstant(new Date('2026-07-15T10:00:00.000Z'))).toBe(
      '2026-07-15T10:00:00.000Z',
    );
  });

  it('normalizes parseable date strings to ISO', () => {
    expect(formatAuditInstant('2026-07-15T10:00:00.000Z')).toBe(
      '2026-07-15T10:00:00.000Z',
    );
  });

  it('returns null for empty or invalid values', () => {
    expect(formatAuditInstant(null)).toBeNull();
    expect(formatAuditInstant(undefined)).toBeNull();
    expect(formatAuditInstant('')).toBeNull();
    expect(formatAuditInstant(new Date('invalid'))).toBeNull();
  });

  it('formats UTC midnight dates without a time component', () => {
    expect(formatAuditDisplayDateTime('2027-07-15T00:00:00.000Z')).toBe(
      '15 Jul 2027',
    );
  });

  it('formats date-times in a consistent en-IN display style', () => {
    const rendered = formatAuditDisplayDateTime('2026-07-15T10:30:00.000Z');
    expect(rendered).toMatch(/15 Jul 2026/);
    expect(rendered).toMatch(/\d{1,2}:\d{2}/);
  });

  it('detects business date field keys', () => {
    expect(isAuditDateFieldKey('validtillDate')).toBe(true);
    expect(isAuditDateFieldKey('firstNotifyDate')).toBe(true);
    expect(isAuditDateFieldKey('updatedAt')).toBe(true);
    expect(isAuditDateFieldKey('occurred_at')).toBe(true);
    expect(isAuditDateFieldKey('paymentStatus')).toBe(false);
    expect(isAuditDateFieldKey('urnNo')).toBe(false);
  });

  it('preserves month-back default when from is omitted', () => {
    const { from, to } = resolveAuditQueryRange({
      to: '2026-07-15T12:00:00.000Z',
    });
    expect(to.toISOString()).toBe('2026-07-15T12:00:00.000Z');
    expect(from.getUTCMonth()).toBe(5);
  });
});
