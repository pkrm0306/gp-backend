import {
  buildProductFilterForUrnStatusUpdate,
  filterRenewDetailsRows,
  filterRenewEligibleProducts,
  filterRenewRowsByCertifiedEoi,
  isRenewEligibleProduct,
  matchRenewUrnStatusUpdateProducts,
  RENEW_ELIGIBLE_PRODUCT_STATUS,
  shouldLimitUrnStatusUpdateToCertifiedProducts,
} from './renew-eligible-product.util';

describe('renew-eligible-product.util', () => {
  it('allows only certified status', () => {
    expect(RENEW_ELIGIBLE_PRODUCT_STATUS).toBe(2);
    expect(isRenewEligibleProduct({ productStatus: 2 })).toBe(true);
    expect(isRenewEligibleProduct({ productStatus: 3 })).toBe(false);
    expect(isRenewEligibleProduct({ productStatus: 0 })).toBe(false);
    expect(isRenewEligibleProduct({ productStatus: 4 })).toBe(false);
  });

  it('filters product rows', () => {
    const rows = [
      { eoiNo: 'A', productStatus: 2 },
      { eoiNo: 'B', productStatus: 3 },
      { eoiNo: 'C', productStatus: 1 },
    ];
    expect(filterRenewEligibleProducts(rows).map((r) => r.eoiNo)).toEqual(['A']);
  });

  it('filters renew details rows by nested product_details', () => {
    const rows = [
      { product_details: { eoiNo: 'A', productStatus: 2 } },
      { product_details: { eoiNo: 'B', productStatus: 3 } },
    ];
    expect(filterRenewDetailsRows(rows)).toHaveLength(1);
    expect(
      (filterRenewDetailsRows(rows)[0].product_details as { eoiNo: string }).eoiNo,
    ).toBe('A');
  });

  it('limits urnStatus updates to certified products for renew payment / status 12–17', () => {
    expect(shouldLimitUrnStatusUpdateToCertifiedProducts('renew', 14)).toBe(true);
    expect(shouldLimitUrnStatusUpdateToCertifiedProducts('certification', 17)).toBe(true);
    expect(shouldLimitUrnStatusUpdateToCertifiedProducts('certification', 7)).toBe(false);

    expect(matchRenewUrnStatusUpdateProducts({ urnNo: 'URN-1' })).toEqual(
      expect.objectContaining({ productStatus: 2, urnNo: 'URN-1' }),
    );
    expect(
      buildProductFilterForUrnStatusUpdate({ urnNo: 'URN-1' }, 'renew', 13),
    ).toEqual(expect.objectContaining({ productStatus: 2 }));
  });

  it('filterRenewRowsByCertifiedEoi keeps URN-level and certified EOI rows', () => {
    const certified = new Set(['EOI-A']);
    const rows = [
      { documentForm: 'process_innovation', eoiNo: 'EOI-A' },
      { documentForm: 'process_innovation', eoiNo: 'EOI-B' },
      { documentForm: 'process_manufacturing' },
    ];
    expect(filterRenewRowsByCertifiedEoi(rows, certified)).toHaveLength(2);
  });
});
