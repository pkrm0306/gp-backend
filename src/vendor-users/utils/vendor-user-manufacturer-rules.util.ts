import { BadRequestException } from '@nestjs/common';
import {
  isPlatformPortalAccountType,
  isVendorPortalAccountType,
} from '../../common/utils/platform-rbac-scope.util';

export function assertVendorUserManufacturerRules(input: {
  type?: string;
  manufacturerId?: unknown;
  vendorId?: unknown;
}): void {
  const type = String(input.type ?? '').trim().toLowerCase();
  const hasManufacturer = Boolean(
    input.manufacturerId != null && String(input.manufacturerId).trim() !== '',
  );
  const hasVendor = Boolean(
    input.vendorId != null && String(input.vendorId).trim() !== '',
  );

  if (isVendorPortalAccountType(type)) {
    if (!hasManufacturer && !hasVendor) {
      throw new BadRequestException(
        'manufacturerId is required for vendor and partner accounts',
      );
    }
    return;
  }

  if (isPlatformPortalAccountType(type)) {
    if (hasManufacturer || hasVendor) {
      throw new BadRequestException(
        'manufacturerId and vendorId must not be set for admin and staff accounts',
      );
    }
  }
}
