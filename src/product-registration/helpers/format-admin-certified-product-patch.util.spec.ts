import {
  formatAdminCertifiedProductPatchResponse,
  normalizeValidTillForApiResponse,
} from './format-admin-certified-product-patch.util';

describe('normalizeValidTillForApiResponse', () => {
  it('returns ISO string for Date instances', () => {
    const d = new Date('2028-12-31T00:00:00.000Z');
    expect(normalizeValidTillForApiResponse(d)).toBe(d.toISOString());
  });

  it('returns null for empty values', () => {
    expect(normalizeValidTillForApiResponse(null)).toBeNull();
    expect(normalizeValidTillForApiResponse('')).toBeNull();
  });
});

describe('formatAdminCertifiedProductPatchResponse', () => {
  const toId = (v: unknown) => (v == null ? undefined : String(v));

  it('includes valid-till aliases from validtillDate', () => {
    const iso = '2028-12-31T00:00:00.000Z';
    const out = formatAdminCertifiedProductPatchResponse(
      {
        _id: '507f1f77bcf86cd799439011',
        productName: 'Test',
        validtillDate: new Date(iso),
        productStatus: 2,
      },
      toId,
    );
    expect(out.validtillDate).toBe(iso);
    expect(out.validTill).toBe(iso);
    expect(out.validTillDate).toBe(iso);
    expect(out.valid_till_date).toBe(iso);
  });

  it('reads validTillDate alias when validtillDate is absent', () => {
    const iso = '2027-06-15T00:00:00.000Z';
    const out = formatAdminCertifiedProductPatchResponse(
      { _id: 'abc', validTillDate: iso },
      toId,
    );
    expect(out.validTill).toBe(iso);
  });
});
