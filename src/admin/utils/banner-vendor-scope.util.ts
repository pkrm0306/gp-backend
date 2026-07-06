import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { isPlatformPortalJwtUser } from '../../common/utils/platform-rbac-scope.util';

export type BannerAuthUser = {
  vendorId?: string;
  manufacturerId?: string;
  role?: string;
  type?: string;
};

/** Valid ObjectId used when platform admins create CMS banners (schema requires vendorId). */
const DEFAULT_PLATFORM_BANNER_VENDOR_ID = '66a000000000000000000001';

export function getPlatformBannerVendorId(): string {
  const fromEnv = String(process.env.PLATFORM_BANNER_VENDOR_ID ?? '').trim();
  if (fromEnv && Types.ObjectId.isValid(fromEnv)) {
    return fromEnv;
  }
  return DEFAULT_PLATFORM_BANNER_VENDOR_ID;
}

/**
 * Vendor-scoped operators (vendor portal) return their manufacturer id.
 * Platform admin/staff return null → manage all CMS banners.
 */
export function resolveBannerVendorScope(user?: BannerAuthUser): string | null {
  const scoped = String(user?.vendorId ?? user?.manufacturerId ?? '').trim();
  if (scoped) return scoped;
  if (isPlatformPortalJwtUser(user)) return null;
  throw new BadRequestException('Vendor ID not found in token');
}

export function buildBannerVendorScopeFilter(
  vendorScope: string | null,
): Record<string, unknown> {
  if (!vendorScope) return {};
  try {
    const vendorObjectId = new Types.ObjectId(vendorScope);
    return { $or: [{ vendorId: vendorObjectId }, { vendorId: vendorScope }] };
  } catch {
    throw new BadRequestException('Invalid vendor ID format');
  }
}

export function resolveBannerPersistVendorObjectId(
  vendorScope: string | null,
): Types.ObjectId {
  const raw = vendorScope ?? getPlatformBannerVendorId();
  try {
    return new Types.ObjectId(raw);
  } catch {
    throw new BadRequestException('Invalid vendor ID format');
  }
}
