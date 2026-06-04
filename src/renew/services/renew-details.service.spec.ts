import { filterRenewDetailsRows } from '../helpers/renew-eligible-product.util';

describe('RenewDetailsService renew eligibility filtering', () => {
  it('excludes rejected EOIs from details rows (certified-only)', () => {
    const rows = filterRenewDetailsRows([
      {
        product_details: { eoiNo: 'GPPMI001', productStatus: 2, productName: 'Certified' },
      },
      {
        product_details: { eoiNo: 'GPPMI002', productStatus: 3, productName: 'Rejected' },
      },
    ]);

    expect(rows).toHaveLength(1);
    expect((rows[0].product_details as { eoiNo: string }).eoiNo).toBe('GPPMI001');
  });
});
