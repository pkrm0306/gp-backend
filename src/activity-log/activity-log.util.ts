import { ActivityLogDocument } from './schemas/activity-log.schema';
import {
  activityLifecycleName,
  activityLifecycleResponsibility,
  nextActivityLifecycleStatus,
} from './activity-lifecycle.constants';
import { ActivityWorkflowItemStatus } from './activity-workflow.constants';

/** Marks timeline rows that must not become Quick View "current activity". */
export const AUXILIARY_ACTIVITY_SUB_IDS = {
  URN_SITE_VISIT: 1,
} as const;

export type ActivityLogLike = {
  activity?: string;
  activities_id?: number;
  activity_status?: number;
  sub_activities_id?: number;
  responsibility?: string;
  next_activity?: string | null;
  next_responsibility?: string | null;
  next_acitivities_id?: number | null;
  status?: number;
  created_at?: Date | string;
  createdAt?: Date | string;
};

const SITE_VISIT_ACTIVITY_PREFIXES = [
  'Admin added site visit ',
  'Admin updated site visit ',
  'Admin deleted site visit ',
] as const;

export function isAuxiliaryActivityLog(row: ActivityLogLike): boolean {
  const subId = Number(row.sub_activities_id);
  if (subId === AUXILIARY_ACTIVITY_SUB_IDS.URN_SITE_VISIT) {
    return true;
  }
  const activity = String(row.activity ?? '').trim();
  return SITE_VISIT_ACTIVITY_PREFIXES.some((prefix) =>
    activity.startsWith(prefix),
  );
}

function sortActivityLogsChronologically(
  logs: ActivityLogLike[],
): ActivityLogLike[] {
  return [...logs].sort((a, b) => {
    const ta = new Date(a.created_at ?? a.createdAt ?? 0).getTime();
    const tb = new Date(b.created_at ?? b.createdAt ?? 0).getTime();
    return ta - tb;
  });
}

/**
 * Quick View current step — last lifecycle row, skipping auxiliary admin events
 * (e.g. site visit CRUD) that must not override workflow stage.
 */
export function resolveCurrentWorkflowActivityLog(
  logs: ActivityLogLike[],
  urnStatus?: number,
): Record<string, unknown> | null {
  const sorted = sortActivityLogsChronologically(logs);

  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const row = sorted[i];
    if (isAuxiliaryActivityLog(row)) {
      continue;
    }
    if (Number(row.status) === ActivityWorkflowItemStatus.Pending) {
      return {
        ...formatActivityLogRow(row as ActivityLogDocument),
        status: ActivityWorkflowItemStatus.Pending,
      };
    }
  }

  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const row = sorted[i];
    if (isAuxiliaryActivityLog(row)) {
      continue;
    }
    return {
      ...formatActivityLogRow(row as ActivityLogDocument),
      status: ActivityWorkflowItemStatus.Pending,
    };
  }

  if (typeof urnStatus !== 'number' || !Number.isFinite(urnStatus)) {
    return null;
  }

  const status = Math.trunc(urnStatus);
  const nextId = nextActivityLifecycleStatus(status);
  return {
    activities_id: status,
    activity_status: status,
    activity: activityLifecycleName(status),
    status: 0,
    responsibility: activityLifecycleResponsibility(status),
    next_acitivities_id: nextId,
    next_activity: activityLifecycleName(nextId),
    next_responsibility: activityLifecycleResponsibility(nextId),
  };
}

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
    sub_activities_id: plain.sub_activities_id,
    created_at: createdAt,
    updated_at: updatedAt,
    createdAt,
    updatedAt,
  };
}
