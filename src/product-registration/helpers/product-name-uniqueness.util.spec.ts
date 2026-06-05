import {
  normalizeProductNameForComparison,
  productNameEqualsFilter,
} from './product-name-uniqueness.util';

describe('product-name-uniqueness', () => {
  it('normalizes whitespace', () => {
    expect(normalizeProductNameForComparison('  foo   bar  ')).toBe('foo bar');
  });

  it('builds case-insensitive exact regex', () => {
    expect(productNameEqualsFilter('Test Product')).toEqual({
      $regex: '^Test Product$',
      $options: 'i',
    });
  });

  it('escapes regex metacharacters', () => {
    expect(productNameEqualsFilter('12 DOOR (A)')).toEqual({
      $regex: '^12 DOOR \\(A\\)$',
      $options: 'i',
    });
  });
});
