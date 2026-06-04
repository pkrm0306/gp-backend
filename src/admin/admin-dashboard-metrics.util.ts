import { ACTIVITY_LIFECYCLE_STEPS } from '../activity-log/activity-lifecycle.constants';

/** URN lifecycle labels (matches activity log lifecycle). */
export const URN_STATUS_LABELS: Readonly<Record<number, string>> =
  Object.fromEntries(
    Object.entries(ACTIVITY_LIFECYCLE_STEPS).map(([status, step]) => [
      Number(status),
      step.activity,
    ]),
  ) as Readonly<Record<number, string>>;

export function urnStatusLabel(status: number): string {
  return URN_STATUS_LABELS[status] ?? `Unknown (${status})`;
}

export function manufacturerStatusKey(status: number): string {
  switch (status) {
    case 1:
      return 'verified';
    case 2:
      return 'unverified';
    default:
      return 'inactivePending';
  }
}
