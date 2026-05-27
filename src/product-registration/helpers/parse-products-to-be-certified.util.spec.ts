import { Types } from 'mongoose';
import {
  formatProductsToBeCertified,
  getProductsToBeCertifiedValidationError,
  normalizeProductsToBeCertifiedStorage,
  parseProductsToBeCertified,
  resolveProductIdsFromCertifiedField,
} from './parse-products-to-be-certified.util';

describe('parseProductsToBeCertified', () => {
  it('parses JSON array of product ids', () => {
    const result = parseProductsToBeCertified('[101, 102]');
    expect(result.productIds).toEqual([101, 102]);
    expect(result.mongoIds).toHaveLength(0);
  });

  it('parses comma-separated ids', () => {
    const result = parseProductsToBeCertified('5, 7, 7');
    expect(result.productIds).toEqual([5, 7]);
  });

  it('parses ObjectId strings', () => {
    const id = new Types.ObjectId();
    const result = parseProductsToBeCertified(JSON.stringify([id.toString()]));
    expect(result.mongoIds).toHaveLength(1);
    expect(result.mongoIds[0].toString()).toBe(id.toString());
  });

  it('returns empty for blank input', () => {
    expect(parseProductsToBeCertified('')).toEqual({
      productIds: [],
      mongoIds: [],
    });
  });

  it('does not resolve product names as IDs', () => {
    const ids = resolveProductIdsFromCertifiedField('test pikk', [
      { productId: 42 },
      { productId: 43 },
    ]);
    expect(ids).toEqual([]);
  });

  it('formats product id array for API storage', () => {
    expect(formatProductsToBeCertified([42, 42, 7])).toBe('[42,7]');
  });

  it('reports validation error for free text', () => {
    expect(getProductsToBeCertifiedValidationError('test plkk')).toContain(
      'productId',
    );
  });

  it('normalizes storage to JSON productId array', () => {
    expect(normalizeProductsToBeCertifiedStorage('101, 102')).toBe('[101,102]');
  });
});
