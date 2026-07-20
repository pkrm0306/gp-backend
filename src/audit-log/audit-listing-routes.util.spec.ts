import { isListingAuditPath } from './audit-listing-routes.util';

describe('isListingAuditPath', () => {
  it('matches common list endpoints', () => {
    expect(isListingAuditPath('/api/admin/products/list')).toBe(true);
    expect(isListingAuditPath('/api/admin/products/list/filter-options')).toBe(
      true,
    );
    expect(isListingAuditPath('/admin/banner/list')).toBe(true);
    expect(isListingAuditPath('/admin/payments/list')).toBe(true);
    expect(
      isListingAuditPath('/website/public/products/certified/list/legacy'),
    ).toBe(true);
  });

  it('matches audit log read APIs', () => {
    expect(isListingAuditPath('/admin/audit-log')).toBe(true);
    expect(isListingAuditPath('/admin/audit-log/filters')).toBe(true);
    expect(isListingAuditPath('/admin/audit-log/665f1a2b3c4d5e6f7a8b9c0d1')).toBe(
      true,
    );
  });

  it('matches search, export, and dropdown helpers', () => {
    expect(isListingAuditPath('/countries/search')).toBe(true);
    expect(isListingAuditPath('/admin/team-member/search/by-name')).toBe(true);
    expect(isListingAuditPath('/api/sectors/export')).toBe(true);
    expect(isListingAuditPath('/countries/dropdown')).toBe(true);
    expect(
      isListingAuditPath('/website/public/products/certified/filter-options'),
    ).toBe(true);
    expect(isListingAuditPath('/api/admin/spoc-allocation/lookup')).toBe(true);
  });

  it('does not match mutating business routes', () => {
    expect(isListingAuditPath('/payments')).toBe(false);
    expect(isListingAuditPath('/payments/urn-1')).toBe(false);
    expect(isListingAuditPath('/api/admin/products/urn-status')).toBe(false);
    expect(isListingAuditPath('/product-design')).toBe(false);
    expect(isListingAuditPath('/categories/1')).toBe(false);
    expect(isListingAuditPath('/api/admin/spoc-allocation')).toBe(false);
    expect(isListingAuditPath('/api/admin/spoc-allocation/12')).toBe(false);
  });
});
