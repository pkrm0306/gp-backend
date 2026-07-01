import { Types } from 'mongoose';
import { isPlatformAdminUser } from './platform-admin.util';

export const PLATFORM_RBAC_CACHE_KEY = 'platform';

export function isPlatformPortalAccountType(type?: string): boolean {
  const t = String(type ?? '')
    .trim()
    .toLowerCase();
  return t === 'admin' || t === 'staff';
}

export function isVendorPortalAccountType(type?: string): boolean {
  const t = String(type ?? '')
    .trim()
    .toLowerCase();
  return t === 'vendor' || t === 'partner';
}

export function isPlatformPortalJwtUser(user?: {
  role?: string;
  type?: string;
}): boolean {
  if (isPlatformAdminUser(user)) {
    return true;
  }
  return String(user?.role ?? user?.type ?? '')
    .trim()
    .toLowerCase() === 'staff';
}

/** Mongo filter for platform-scoped RBAC rows (roles, staff_role_mappings). */
export function platformRbacManufacturerFilter(): Record<string, unknown> {
  return {
    $or: [
      { manufacturerId: null },
      { manufacturerId: { $exists: false } },
    ],
  };
}

export function platformPortalUserManufacturerFilter(): Record<string, unknown> {
  return platformRbacManufacturerFilter();
}

export function manufacturerRbacFilter(
  manufacturerId: string,
): Record<string, unknown> {
  return { manufacturerId: new Types.ObjectId(manufacturerId) };
}

/** RBAC tenant filter: platform scope when manufacturerId is omitted. */
export function rbacScopeFilter(
  manufacturerId?: string | null,
): Record<string, unknown> {
  const id = String(manufacturerId ?? '').trim();
  if (!id) {
    return platformRbacManufacturerFilter();
  }
  return manufacturerRbacFilter(id);
}

export function resolveRbacCacheScope(manufacturerId?: string | null): string {
  return String(manufacturerId ?? '').trim() || PLATFORM_RBAC_CACHE_KEY;
}

/** Stored on platform-scoped Role / StaffRoleMapping documents. */
export function platformRbacScopeDocument(): { manufacturerId: null } {
  return { manufacturerId: null };
}
