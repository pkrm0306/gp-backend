/**
 * Vendor dashboard progress — built dynamically from products.urnStatus + activity_log.
 * Design mockups (GreenCo labels) are not used; labels come from logged activities or URN lifecycle.
 */

export const URN_LIFECYCLE_MAX_STATUS = 11;

export const URN_ACTIVITY_NAMES: Readonly<Record<number, string>> = {
  0: 'Proposal Pending',
  1: 'Registration Payment',
  2: 'Approve Registration Fee',
  3: 'Process Form In Progress',
  4: 'Process Form Submitted',
  5: 'Vendor Response',
  6: 'Final Verification',
  7: 'Certificate Payment',
  8: 'Approve Certificate Fee',
  9: 'Payment Rejected',
  10: 'Approved Certificate Fee',
  11: 'Certificate Published',
};

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
  return URN_ACTIVITY_NAMES[status] ?? `Step ${status}`;
}

export function nextUrnActivityId(currentStatus: number): number {
  if (currentStatus >= URN_LIFECYCLE_MAX_STATUS) {
    return URN_LIFECYCLE_MAX_STATUS;
  }
  if (currentStatus === 4) return 6;
  if (currentStatus === 8) return 10;
  return Math.min(currentStatus + 1, URN_LIFECYCLE_MAX_STATUS);
}

/** Previous milestone (inverse of next-step skips). */
export function previousUrnActivityId(currentStatus: number): number {
  if (currentStatus <= 0) return 0;
  if (currentStatus === 6) return 4;
  if (currentStatus === 10) return 8;
  return currentStatus - 1;
}

export function urnResponsibilityOwner(status: number): 'Admin' | 'Vendor' {
  switch (status) {
    case 0:
    case 2:
    case 6:
    case 8:
    case 9:
    case 10:
    case 11:
      return 'Admin';
    default:
      return 'Vendor';
  }
}

/** Vendor UI: Admin → CII, Vendor → Company */
export function toVendorPanelResponsibility(
  owner: string | undefined | null,
): string {
  const v = String(owner ?? '').trim();
  if (!v) return 'Company';
  if (v.toLowerCase() === 'admin' || v.toLowerCase() === 'cii') {
    return 'CII';
  }
  if (v.toLowerCase() === 'vendor' || v.toLowerCase() === 'company') {
    return 'Company';
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

/**
 * Stepper: milestones 0 … displayEnd (current URN position + next pending step).
 * Status from live products.urnStatus; labels prefer activity_log text.
 */
export function buildDynamicProgressSteps(
  urnStatus: number,
  logs: ActivityLogLike[],
): VendorProgressStepRow[] {
  const logById = indexLogsByActivityId(logs);
  const displayEnd =
    urnStatus >= URN_LIFECYCLE_MAX_STATUS
      ? URN_LIFECYCLE_MAX_STATUS
      : nextUrnActivityId(urnStatus);

  const steps: VendorProgressStepRow[] = [];
  for (let id = 0; id <= displayEnd; id += 1) {
    let status: VendorProgressStepStatus = 'pending';
    if (urnStatus >= URN_LIFECYCLE_MAX_STATUS || id < urnStatus) {
      status = 'completed';
    } else if (id === urnStatus) {
      status = 'active';
    }

    steps.push({
      id,
      label: labelForActivityId(id, logById),
      status,
      responsibility: responsibilityForActivityId(id, logById),
    });
  }
  return steps;
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

  const completedId =
    urnStatus >= URN_LIFECYCLE_MAX_STATUS
      ? URN_LIFECYCLE_MAX_STATUS
      : urnStatus > 0
        ? previousUrnActivityId(urnStatus)
        : typeof latestLog?.activities_id === 'number'
          ? latestLog.activities_id
          : 0;

  const latestStepCompleted: VendorProgressActionRow | null =
    input.urnNo &&
    (urnStatus > 0 ||
      urnStatus >= URN_LIFECYCLE_MAX_STATUS ||
      Boolean(latestLog?.activity))
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

  const nextId =
    typeof latestLog?.next_acitivities_id === 'number'
      ? latestLog.next_acitivities_id
      : nextUrnActivityId(urnStatus);

  const nextActivityId =
    urnStatus < URN_LIFECYCLE_MAX_STATUS ? urnStatus : nextId;
  const nextStep: VendorProgressActionRow | null =
    input.urnNo && urnStatus < URN_LIFECYCLE_MAX_STATUS
      ? {
          activity: String(
            latestLog?.next_activity?.trim() ||
              labelForActivityId(urnStatus, logById),
          ),
          status: 'Pending',
          responsibility: toVendorPanelResponsibility(
            latestLog?.next_responsibility ??
              urnResponsibilityOwner(urnStatus),
          ),
          activitiesId: nextActivityId,
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
