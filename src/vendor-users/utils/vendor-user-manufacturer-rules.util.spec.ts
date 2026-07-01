import { BadRequestException } from '@nestjs/common';
import { assertVendorUserManufacturerRules } from './vendor-user-manufacturer-rules.util';

describe('assertVendorUserManufacturerRules', () => {
  it('requires manufacturer for vendor accounts', () => {
    expect(() =>
      assertVendorUserManufacturerRules({ type: 'vendor' }),
    ).toThrow(BadRequestException);
  });

  it('allows vendor with manufacturerId', () => {
    expect(() =>
      assertVendorUserManufacturerRules({
        type: 'vendor',
        manufacturerId: '507f1f77bcf86cd799439011',
      }),
    ).not.toThrow();
  });

  it('rejects manufacturerId on staff accounts', () => {
    expect(() =>
      assertVendorUserManufacturerRules({
        type: 'staff',
        manufacturerId: '507f1f77bcf86cd799439011',
      }),
    ).toThrow(BadRequestException);
  });

  it('allows admin without manufacturerId', () => {
    expect(() =>
      assertVendorUserManufacturerRules({ type: 'admin' }),
    ).not.toThrow();
  });
});
