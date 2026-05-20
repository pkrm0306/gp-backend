import { ActivityLogDocument } from './schemas/activity-log.schema';

export type ActivityLogCaller = {
  role?: string;
  type?: string;
  vendorId?: string;
  manufacturerId?: string;
  userId?: string;
  sub?: string;
};

export function normalizeUrnNo(value?: string): string {
  return String(value ?? '')
    .trim()
    .replace(/\/+$/g, '');
}

export function urnCandidates(urnNo: string): string[] {
  const normalized = normalizeUrnNo(urnNo);
  if (!normalized) return [];
  return [normalized, `${normalized}/`];
}

export function isAdminPortalRole(role?: string): boolean {
  const r = String(role ?? '').toLowerCase();
  return r === 'admin' || r === 'staff';
}

export function isVendorPortalRole(role?: string): boolean {
  const r = String(role ?? '').toLowerCase();
  return r === 'vendor' || r === 'partner';
}

export function callerOrganizationId(user?: ActivityLogCaller): string | undefined {
  if (!user) return undefined;
  const id = user.manufacturerId ?? user.vendorId;
  return id !== undefined && id !== null ? String(id) : undefined;
}

export function formatActivityLogRow(
  doc: ActivityLogDocument | Record<string, unknown>,
): Record<string, unknown> {
  const plain =
    typeof (doc as ActivityLogDocument).toObject === 'function'
      ? (doc as ActivityLogDocument).toObject()
      : { ...(doc as Record<string, unknown>) };

  const createdAt = plain.created_at ?? plain.createdAt;
  const updatedAt = plain.updated_at ?? plain.updatedAt;

  return {
    ...plain,
    _id: plain._id != null ? String(plain._id) : undefined,
    urnNo: plain.urn_no ?? plain.urnNo,
    urn_no: plain.urn_no ?? plain.urnNo,
    activity: plain.activity,
    status: plain.status,
    activity_status: plain.activity_status ?? plain.status,
    responsibility: plain.responsibility,
    next_activity: plain.next_activity,
    next_responsibility: plain.next_responsibility,
    next_acitivities_id: plain.next_acitivities_id,
    activities_id: plain.activities_id,
    created_at: createdAt,
    updated_at: updatedAt,
    createdAt,
    updatedAt,
  };
}
