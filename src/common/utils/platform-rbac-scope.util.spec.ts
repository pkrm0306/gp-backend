import {
  isPlatformPortalAccountType,
  isVendorPortalAccountType,
  platformRbacManufacturerFilter,
  rbacScopeFilter,
  resolveRbacCacheScope,
} from './platform-rbac-scope.util';

describe('platform-rbac-scope.util', () => {
  it('classifies portal account types', () => {
    expect(isPlatformPortalAccountType('admin')).toBe(true);
    expect(isPlatformPortalAccountType('staff')).toBe(true);
    expect(isPlatformPortalAccountType('vendor')).toBe(false);
    expect(isVendorPortalAccountType('partner')).toBe(true);
    expect(isVendorPortalAccountType('staff')).toBe(false);
  });

  it('uses platform filter when manufacturerId is omitted', () => {
    expect(rbacScopeFilter(undefined)).toEqual(platformRbacManufacturerFilter());
    expect(rbacScopeFilter('')).toEqual(platformRbacManufacturerFilter());
    expect(resolveRbacCacheScope(undefined)).toBe('platform');
  });

  it('scopes to manufacturer when id is provided', () => {
    const id = '507f1f77bcf86cd799439011';
    expect(rbacScopeFilter(id)).toEqual({
      manufacturerId: expect.any(Object),
    });
    expect(resolveRbacCacheScope(id)).toBe(id);
  });
});
