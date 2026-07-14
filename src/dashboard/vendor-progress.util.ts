/**
 * Vendor dashboard progress — built dynamically from products.urnStatus + activity_log.
 * Design mockups (GreenCo labels) are not used; labels come from logged activities or URN lifecycle.
 */

import {
  ACTIVITY_LIFECYCLE_MAX_STATUS,
  ACTIVITY_LIFECYCLE_STEPS,
  activityLifecycleName,
  activityLifecycleResponsibility,
  nextActivityLifecycleStatus,
} from '../activity-log/activity-lifecycle.constants';
import { URN_STATUS_PENDING_ACTIVITY } from '../activity-log/activity-workflow.constants';

export const URN_LIFECYCLE_MAX_STATUS = ACTIVITY_LIFECYCLE_MAX_STATUS;

/** Canonical 11-step certification journey shown in the vendor dashboard (excludes renewal). */
export const CERTIFICATION_JOURNEY_ACTIVITY_IDS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
] as const;

export const CERTIFICATION_JOURNEY_STEP_COUNT =
  CERTIFICATION_JOURNEY_ACTIVITY_IDS.length;

export const URN_ACTIVITY_NAMES: Readonly<Record<number, string>> =
  Object.fromEntries(
    Object.entries(ACTIVITY_LIFECYCLE_STEPS).map(([status, step]) => [
      Number(status),
      step.activity,
    ]),
  ) as Readonly<Record<number, string>>;

export type VendorProgressStepStatus = 'completed' | 'active' | 'pending';

export type VendorProgressStepRow = {
  /** URN lifecycle activities_id */
  id: number;
  label: string;
  status: VendorProgressStepStatus;
  responsibility: string;
};

export type VendorProgressActionRow = {
  activity: string;
  status: 'Done' | 'Pending';
  responsibility: string;
  activitiesId?: number;
  updatedAt?: string;
};

export type VendorProgressTimelineRow = {
  activitiesId: number;
  activity: string;
  activityStatus: number;
  responsibility: string;
  nextActivity: string | null;
  nextResponsibility: string | null;
  nextActivitiesId: number | null;
  createdAt: string | null;
};

export type VendorProgressTracking = {
  urnNo: string | null;
  urnStatus: number | null;
  activeStepIndex: number;
  /** Vertical stepper — derived from URN status + activity log labels */
  progressSteps: VendorProgressStepRow[];
  /** @deprecated Use progressSteps */
  greencoSteps: VendorProgressStepRow[];
  /** Chronological activity_log rows for this URN */
  timeline: VendorProgressTimelineRow[];
  latestStepCompleted: VendorProgressActionRow | null;
  nextStep: VendorProgressActionRow | null;
  /** 0–100 based on completed steps in progressSteps */
  percentComplete: number;
};

export type ActivityLogLike = {
  activity?: string;
  responsibility?: string;
  next_activity?: string;
  next_responsibility?: string;
  next_acitivities_id?: number;
  activities_id?: number;
  activity_status?: number;
  created_at?: Date;
};

export function urnActivityName(status: number): string {
  return activityLifecycleName(status);
}

export function nextUrnActivityId(currentStatus: number): number {
  return nextActivityLifecycleStatus(currentStatus);
}

/** Previous milestone in the activity lifecycle. */
export function previousUrnActivityId(currentStatus: number): number {
  if (currentStatus <= 0) return 0;
  return currentStatus - 1;
}

export function urnResponsibilityOwner(
  status: number,
): 'Admin' | 'Manufacturer' {
  return activityLifecycleResponsibility(status);
}

/** Pending workflow activity for a URN status, or null when the journey is complete. */
export function resolvePendingActivityId(urnStatus: number): number | null {
  if (urnStatus >= URN_LIFECYCLE_MAX_STATUS) return null;
  const pending = URN_STATUS_PENDING_ACTIVITY[urnStatus];
  if (pending === undefined) return null;
  return pending;
}

/** Map urnStatus to completed / active / pending for each of the 12 journey steps. */
export function resolveJourneyStepStatuses(
  urnStatus: number,
): VendorProgressStepStatus[] {
  const pendingActivityId = resolvePendingActivityId(urnStatus);

  if (pendingActivityId === null && urnStatus >= URN_LIFECYCLE_MAX_STATUS) {
    return CERTIFICATION_JOURNEY_ACTIVITY_IDS.map(() => 'completed');
  }

  const pendingIndex = CERTIFICATION_JOURNEY_ACTIVITY_IDS.indexOf(
    pendingActivityId as (typeof CERTIFICATION_JOURNEY_ACTIVITY_IDS)[number],
  );

  if (pendingIndex < 0) {
    return CERTIFICATION_JOURNEY_ACTIVITY_IDS.map(() => 'pending');
  }

  return CERTIFICATION_JOURNEY_ACTIVITY_IDS.map((_, displayIndex) => {
    if (displayIndex < pendingIndex) return 'completed';
    if (displayIndex === pendingIndex) return 'active';
    return 'pending';
  });
}

/** Normalize old labels to the canonical activity-log responsibility names. */
export function toVendorPanelResponsibility(
  owner: string | undefined | null,
): string {
  const v = String(owner ?? '').trim();
  if (!v) return 'Manufacturer';
  if (v.toLowerCase() === 'admin' || v.toLowerCase() === 'cii') {
    return 'Admin';
  }
  if (
    v.toLowerCase() === 'vendor' ||
    v.toLowerCase() === 'company' ||
    v.toLowerCase() === 'manufacturer'
  ) {
    return 'Manufacturer';
  }
  return v;
}

function sortLogsChronologically(logs: ActivityLogLike[]): ActivityLogLike[] {
  return [...logs].sort((a, b) => {
    const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
    return ta - tb;
  });
}

/** Latest activity_log row per activities_id (last write wins). */
function indexLogsByActivityId(
  logs: ActivityLogLike[],
): Map<number, ActivityLogLike> {
  const map = new Map<number, ActivityLogLike>();
  for (const log of sortLogsChronologically(logs)) {
    const id = Number(log.activities_id);
    if (!Number.isFinite(id)) continue;
    map.set(id, log);
  }
  return map;
}

function labelForActivityId(
  activityId: number,
  logById: Map<number, ActivityLogLike>,
): string {
  const fromLog = logById.get(activityId)?.activity;
  if (fromLog && String(fromLog).trim()) {
    return String(fromLog).trim();
  }
  return urnActivityName(activityId);
}

function responsibilityForActivityId(
  activityId: number,
  logById: Map<number, ActivityLogLike>,
): string {
  const fromLog = logById.get(activityId)?.responsibility;
  if (fromLog) {
    return toVendorPanelResponsibility(fromLog);
  }
  return toVendorPanelResponsibility(urnResponsibilityOwner(activityId));
}

function resolveLatestCompletedActivityId(urnStatus: number): number | null {
  const pendingActivityId = resolvePendingActivityId(urnStatus);

  if (pendingActivityId === null && urnStatus >= URN_LIFECYCLE_MAX_STATUS) {
    return CERTIFICATION_JOURNEY_ACTIVITY_IDS[
      CERTIFICATION_JOURNEY_ACTIVITY_IDS.length - 1
    ];
  }

  if (pendingActivityId === null) return null;

  const pendingIndex = CERTIFICATION_JOURNEY_ACTIVITY_IDS.indexOf(
    pendingActivityId as (typeof CERTIFICATION_JOURNEY_ACTIVITY_IDS)[number],
  );
  if (pendingIndex <= 0) return null;

  return CERTIFICATION_JOURNEY_ACTIVITY_IDS[pendingIndex - 1];
}

/**
 * Always returns all 12 certification journey steps.
 * Completion is derived from products.urnStatus via URN_STATUS_PENDING_ACTIVITY.
 */
export function buildDynamicProgressSteps(
  urnStatus: number,
  logs: ActivityLogLike[],
): VendorProgressStepRow[] {
  const logById = indexLogsByActivityId(logs);
  const statuses = resolveJourneyStepStatuses(urnStatus);

  return CERTIFICATION_JOURNEY_ACTIVITY_IDS.map((activityId, index) => ({
    id: activityId,
    label: labelForActivityId(activityId, logById),
    status: statuses[index] ?? 'pending',
    responsibility: responsibilityForActivityId(activityId, logById),
  }));
}

export function buildProgressTimeline(
  logs: ActivityLogLike[],
): VendorProgressTimelineRow[] {
  return sortLogsChronologically(logs).map((log) => ({
    activitiesId: Number(log.activities_id ?? 0),
    activity: String(log.activity ?? '').trim(),
    activityStatus: Number(log.activity_status ?? 0),
    responsibility: toVendorPanelResponsibility(log.responsibility),
    nextActivity: log.next_activity
      ? String(log.next_activity).trim()
      : null,
    nextResponsibility: log.next_responsibility
      ? toVendorPanelResponsibility(log.next_responsibility)
      : null,
    nextActivitiesId:
      typeof log.next_acitivities_id === 'number'
        ? log.next_acitivities_id
        : null,
    createdAt: log.created_at
      ? new Date(log.created_at).toISOString()
      : null,
  }));
}

export function buildVendorProgressTracking(input: {
  urnNo: string | null;
  urnStatus: number | null;
  activityLogs?: ActivityLogLike[];
}): VendorProgressTracking {
  const urnStatus =
    typeof input.urnStatus === 'number' && Number.isFinite(input.urnStatus)
      ? Math.max(
          0,
          Math.min(URN_LIFECYCLE_MAX_STATUS, Math.trunc(input.urnStatus)),
        )
      : 0;

  const sortedLogs = sortLogsChronologically(input.activityLogs ?? []);
  const logById = indexLogsByActivityId(sortedLogs);
  const timeline = buildProgressTimeline(sortedLogs);
  const progressSteps = input.urnNo
    ? buildDynamicProgressSteps(urnStatus, sortedLogs)
    : [];

  const activeStepIndex = progressSteps.findIndex((s) => s.status === 'active');
  const resolvedActiveIndex =
    activeStepIndex >= 0 ? activeStepIndex : Math.max(0, progressSteps.length - 1);

  const latestLog =
    sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1] : null;

  const completedId = resolveLatestCompletedActivityId(urnStatus);

  const latestStepCompleted: VendorProgressActionRow | null =
    input.urnNo && completedId != null
      ? {
          activity: labelForActivityId(completedId, logById),
          status: 'Done',
          responsibility: responsibilityForActivityId(completedId, logById),
          activitiesId: completedId,
          updatedAt: latestLog?.created_at
            ? new Date(latestLog.created_at).toISOString()
            : undefined,
        }
      : null;

  const pendingActivityId = resolvePendingActivityId(urnStatus);
  const nextStep: VendorProgressActionRow | null =
    input.urnNo && pendingActivityId != null
      ? {
          activity: String(
            latestLog?.next_activity?.trim() ||
              labelForActivityId(pendingActivityId, logById),
          ),
          status: 'Pending',
          responsibility: toVendorPanelResponsibility(
            latestLog?.next_responsibility ??
              responsibilityForActivityId(pendingActivityId, logById),
          ),
          activitiesId: pendingActivityId,
        }
      : null;

  const completedCount = progressSteps.filter(
    (s) => s.status === 'completed',
  ).length;
  const percentComplete =
    progressSteps.length > 0
      ? Math.round(
          (completedCount / progressSteps.length) * 100,
        )
      : 0;

  return {
    urnNo: input.urnNo,
    urnStatus: input.urnNo ? urnStatus : null,
    activeStepIndex: input.urnNo ? resolvedActiveIndex : 0,
    progressSteps,
    greencoSteps: progressSteps,
    timeline,
    latestStepCompleted,
    nextStep,
    percentComplete,
  };
}
