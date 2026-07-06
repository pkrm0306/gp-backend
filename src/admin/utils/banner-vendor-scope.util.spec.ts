import { BadRequestException } from '@nestjs/common';
import {
  buildBannerVendorScopeFilter,
  resolveBannerVendorScope,
} from './banner-vendor-scope.util';

describe('banner-vendor-scope.util', () => {
  it('returns vendor scope for vendor tokens', () => {
    expect(
      resolveBannerVendorScope({ vendorId: '507f1f77bcf86cd799439011' }),
    ).toBe('507f1f77bcf86cd799439011');
  });

  it('returns null for platform admin/staff', () => {
    expect(resolveBannerVendorScope({ role: 'admin' })).toBeNull();
    expect(resolveBannerVendorScope({ type: 'staff' })).toBeNull();
  });

  it('throws for non-platform users without vendor id', () => {
    expect(() => resolveBannerVendorScope({ role: 'vendor' })).toThrow(
      BadRequestException,
    );
  });

  it('builds empty filter for platform scope', () => {
    expect(buildBannerVendorScopeFilter(null)).toEqual({});
  });
});
