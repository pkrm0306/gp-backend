/**
 * Maps `activity_log.activities_id` (0–11) into admin dashboard timing buckets.
 * Labels align with the dashboard "Time at Stage" and "Avg. Time to Certification" widgets.
 */

export type CertificationTimingStageKey =
  | 'profile'
  | 'urn'
  | 'eoi'
  | 'payment'
  | 'review'
  | 'verified'
  | 'certified';

export type CertificationTimingBreakdownKey =
  | 'technical'
  | 'audit'
  | 'review';

export const CERTIFICATION_TIMING_STAGE_DEFS: ReadonlyArray<{
  key: CertificationTimingStageKey;
  label: string;
  order: number;
}> = [
  { key: 'profile', label: 'Profile', order: 1 },
  { key: 'urn', label: 'URN', order: 2 },
  { key: 'eoi', label: 'EOI', order: 3 },
  { key: 'payment', label: 'Payment', order: 4 },
  { key: 'review', label: 'Review', order: 5 },
  { key: 'verified', label: 'Verified', order: 6 },
  { key: 'certified', label: 'Certified', order: 7 },
];

export const CERTIFICATION_TIMING_BREAKDOWN_DEFS: ReadonlyArray<{
  key: CertificationTimingBreakdownKey;
  label: string;
  order: number;
}> = [
  { key: 'technical', label: 'Technical', order: 1 },
  { key: 'audit', label: 'Audit', order: 2 },
  { key: 'review', label: 'Review', order: 3 },
];

export type ActivityLogTimingRow = {
  activities_id?: number;
  created_at?: Date;
};

export type UrnTimingMilestone = {
  activityId: number;
  at: Date;
};

export function mapActivityIdToTimingStage(
  activityId: number,
): CertificationTimingStageKey | null {
  if (activityId === 0) return 'urn';
  if (activityId === 1) return 'eoi';
  if (activityId >= 2 && activityId <= 4) return 'payment';
  if (activityId >= 5 && activityId <= 6) return 'review';
  if (activityId === 7) return 'verified';
  if (activityId >= 8 && activityId <= 11) return 'certified';
  return null;
}

export function mapActivityIdToBreakdownKey(
  activityId: number,
): CertificationTimingBreakdownKey | null {
  if (activityId >= 5 && activityId <= 6) return 'technical';
  if (activityId === 7) return 'audit';
  if (activityId >= 8 && activityId <= 10) return 'review';
  return null;
}

export function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function roundTimingDays(value: number): number {
  return Math.round(value * 10) / 10;
}

export function averageDays(total: number, count: number): number {
  if (count <= 0) return 0;
  return roundTimingDays(total / count);
}

/** Earliest `created_at` per activities_id for one URN timeline. */
export function buildUrnMilestones(
  logs: ActivityLogTimingRow[],
  certifiedDate?: Date | null,
): UrnTimingMilestone[] {
  const byId = new Map<number, Date>();

  for (const log of logs) {
    const activityId = Number(log.activities_id);
    if (!Number.isFinite(activityId)) continue;
    const at = log.created_at ? new Date(log.created_at) : null;
    if (!at || Number.isNaN(at.getTime())) continue;
    const existing = byId.get(activityId);
    if (!existing || at.getTime() < existing.getTime()) {
      byId.set(activityId, at);
    }
  }

  const milestones = [...byId.entries()]
    .map(([activityId, at]) => ({ activityId, at }))
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  if (certifiedDate) {
    const certifiedAt = new Date(certifiedDate);
    if (!Number.isNaN(certifiedAt.getTime())) {
      const last = milestones[milestones.length - 1];
      if (!last || certifiedAt.getTime() > last.at.getTime()) {
        milestones.push({ activityId: 11, at: certifiedAt });
      }
    }
  }

  return milestones;
}

export function computeStageDurationsFromMilestones(
  milestones: UrnTimingMilestone[],
): Map<CertificationTimingStageKey, number> {
  const durations = new Map<CertificationTimingStageKey, number>();

  for (let i = 0; i < milestones.length - 1; i += 1) {
    const current = milestones[i];
    const next = milestones[i + 1];
    const stage = mapActivityIdToTimingStage(current.activityId);
    if (!stage) continue;
    const days = daysBetween(current.at, next.at);
    durations.set(stage, (durations.get(stage) ?? 0) + days);
  }

  return durations;
}

export function computeBreakdownDurationsFromMilestones(
  milestones: UrnTimingMilestone[],
): Map<CertificationTimingBreakdownKey, number> {
  const durations = new Map<CertificationTimingBreakdownKey, number>();

  for (let i = 0; i < milestones.length - 1; i += 1) {
    const current = milestones[i];
    const next = milestones[i + 1];
    const bucket = mapActivityIdToBreakdownKey(current.activityId);
    if (!bucket) continue;
    const days = daysBetween(current.at, next.at);
    durations.set(bucket, (durations.get(bucket) ?? 0) + days);
  }

  return durations;
}

export function computeEndToEndDays(
  milestones: UrnTimingMilestone[],
  certifiedDate?: Date | null,
): number | null {
  const start = milestones.find((m) => m.activityId === 0)?.at ?? milestones[0]?.at;
  if (!start) return null;

  const end =
    certifiedDate && !Number.isNaN(new Date(certifiedDate).getTime())
      ? new Date(certifiedDate)
      : milestones[milestones.length - 1]?.at;

  if (!end) return null;
  return daysBetween(start, end);
}
