import { mapOverall, mapProductApproval } from './vendor-applications.util';

describe('vendor-applications.util status mapping', () => {
  it('maps overall for all productStatus values', () => {
    expect(mapOverall(0)).toEqual({
      overall: 'Pending',
      overall_variant: 'pending',
    });
    expect(mapOverall(1)).toEqual({
      overall: 'Submitted',
      overall_variant: 'submitted',
    });
    expect(mapOverall(2)).toEqual({
      overall: 'Certified',
      overall_variant: 'certified',
    });
    expect(mapOverall(3)).toEqual({
      overall: 'Rejected',
      overall_variant: 'rejected',
    });
    expect(mapOverall(4)).toEqual({
      overall: 'Expired',
      overall_variant: 'expired',
    });
  });

  it('maps product approval Submitted for status 1', () => {
    expect(mapProductApproval(1)).toBe('Submitted');
    expect(mapProductApproval(2)).toBe('Approved');
  });
});
