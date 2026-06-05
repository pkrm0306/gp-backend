import { parseOptionalDecimalNumber } from './parse-optional-number.util';

describe('parseOptionalDecimalNumber', () => {
  it('parses decimal strings and numbers', () => {
    expect(parseOptionalDecimalNumber('10.5')).toBe(10.5);
    expect(parseOptionalDecimalNumber(10.5)).toBe(10.5);
    expect(parseOptionalDecimalNumber('  12.75  ')).toBe(12.75);
  });

  it('returns undefined for empty or invalid values', () => {
    expect(parseOptionalDecimalNumber(undefined)).toBeUndefined();
    expect(parseOptionalDecimalNumber(null)).toBeUndefined();
    expect(parseOptionalDecimalNumber('')).toBeUndefined();
    expect(parseOptionalDecimalNumber('abc')).toBeUndefined();
  });
});
