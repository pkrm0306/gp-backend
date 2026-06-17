import { evaluateUrnAddProductEligibility } from './admin-add-product-to-urn.util';
import {
  PRODUCT_STATUS_PENDING,
  PRODUCT_STATUS_SUBMITTED,
} from '../../renew/constants/product-status.constants';

describe('admin-add-product-to-urn.util', () => {
  it('blocks when certification fee has been raised', () => {
    const result = evaluateUrnAddProductEligibility({
      urnStatus: 7,
      siblingProductStatuses: [0, 1],
      hasCertificationFee: true,
    });
    expect(result.canAddProduct).toBe(false);
    expect(result.blockReason).toContain('certification fee');
  });

  it('blocks when URN is in renewal', () => {
    const result = evaluateUrnAddProductEligibility({
      urnStatus: 15,
      siblingProductStatuses: [0, 1],
    });
    expect(result.canAddProduct).toBe(false);
    expect(result.blockReason).toContain('renewal');
  });

  it('blocks when URN has certified sibling', () => {
    const result = evaluateUrnAddProductEligibility({
      urnStatus: 1,
      siblingProductStatuses: [0, 2],
    });
    expect(result.canAddProduct).toBe(false);
    expect(result.blockReason).toBe('URN has certified products');
  });

  it('defaults new status to 0 when siblings are all pending', () => {
    const result = evaluateUrnAddProductEligibility({
      urnStatus: 1,
      siblingProductStatuses: [0, 0],
    });
    expect(result.canAddProduct).toBe(true);
    expect(result.defaultProductStatus).toBe(PRODUCT_STATUS_PENDING);
  });

  it('defaults new status to 1 when siblings are all submitted', () => {
    const result = evaluateUrnAddProductEligibility({
      urnStatus: 1,
      siblingProductStatuses: [1, 1],
    });
    expect(result.defaultProductStatus).toBe(PRODUCT_STATUS_SUBMITTED);
  });

  it('defaults new status to 0 for mixed pending and submitted', () => {
    const result = evaluateUrnAddProductEligibility({
      urnStatus: 1,
      siblingProductStatuses: [0, 1],
    });
    expect(result.defaultProductStatus).toBe(PRODUCT_STATUS_PENDING);
  });

  it('allows add when only rejected siblings exist', () => {
    const result = evaluateUrnAddProductEligibility({
      urnStatus: 1,
      siblingProductStatuses: [3, 3],
    });
    expect(result.canAddProduct).toBe(true);
    expect(result.defaultProductStatus).toBe(PRODUCT_STATUS_PENDING);
  });

  it('blocks when only expired siblings exist', () => {
    const result = evaluateUrnAddProductEligibility({
      urnStatus: 1,
      siblingProductStatuses: [4],
    });
    expect(result.canAddProduct).toBe(false);
    expect(result.blockReason).toBe('URN has no active un-certified products');
  });
});
