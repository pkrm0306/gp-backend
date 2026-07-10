export type ActivityLifecycleOwner = 'Admin' | 'Manufacturer';

export type ActivityLifecycleStep = {
  activity: string;
  responsibility: ActivityLifecycleOwner;
};

export const ACTIVITY_LIFECYCLE_MAX_STATUS = 11;

export const ACTIVITY_LIFECYCLE_STEPS: Readonly<
  Record<number, ActivityLifecycleStep>
> = {
  0: {
    activity: 'Product Registration',
    responsibility: 'Manufacturer',
  },
  1: {
    activity: 'Product Approve/Reject',
    responsibility: 'Admin',
  },
  2: {
    activity: 'Assign Registration Fee',
    responsibility: 'Admin',
  },
  3: {
    activity: 'Approve/Reject Registration Fee Proposal & Payment',
    responsibility: 'Manufacturer',
  },
  4: {
    activity: 'Approve/Reject Registration Fee',
    responsibility: 'Admin',
  },
  5: {
    activity: 'Process Forms in Progress',
    responsibility: 'Manufacturer',
  },
  6: {
    activity: 'Process Forms Submission',
    responsibility: 'Manufacturer',
  },
  7: {
    activity: 'Review & Submit for Final Review',
    responsibility: 'Admin',
  },
  8: {
    activity: 'Assign Certification Fee',
    responsibility: 'Admin',
  },
  9: {
    activity: 'Certification Fee Payment',
    responsibility: 'Manufacturer',
  },
  10: {
    activity: 'Approve/Reject Certification Fee',
    responsibility: 'Admin',
  },
  11: {
    activity: 'Product renewal completed',
    responsibility: 'Admin',
  },
};

export function activityLifecycleName(status: number): string {
  return ACTIVITY_LIFECYCLE_STEPS[status]?.activity ?? 'Unknown Activity';
}

export function activityLifecycleResponsibility(
  status: number,
): ActivityLifecycleOwner {
  return ACTIVITY_LIFECYCLE_STEPS[status]?.responsibility ?? 'Manufacturer';
}

export function nextActivityLifecycleStatus(currentStatus: number): number {
  if (currentStatus >= ACTIVITY_LIFECYCLE_MAX_STATUS) {
    return ACTIVITY_LIFECYCLE_MAX_STATUS;
  }
  return Math.min(currentStatus + 1, ACTIVITY_LIFECYCLE_MAX_STATUS);
}
