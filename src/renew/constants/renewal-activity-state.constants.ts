import { RENEWAL_URN_STATUS } from './renewal-urn-status.constants';
import { RENEWAL_NEXT_ACTIVITY } from './renewal-activity.constants';

/** User-facing renewal Activity Log labels (business workflow, not raw tip rows). */
export const RENEWAL_ACTIVITY_UI = {
  CYCLE_STARTED: 'Renewal cycle started',
  PAYMENT_GENERATION_PENDING: 'Renewal payment generation pending',
  PAYMENT_GENERATED: 'Renewal payment generated',
  PAYMENT_PENDING: 'Renewal Payment Pending',
  PAYMENT_SUBMITTED: 'Renewal Payment Submitted',
  PAYMENT_VERIFICATION: 'Renewal payment verification',
  PAYMENT_APPROVED: 'Renewal payment approved by admin',
  PAYMENT_REJECTED: 'Renewal payment rejected by admin',
  FORMS_IN_PROGRESS: 'Renewal process forms in progress',
  FORMS_SUBMITTED: 'Renewal process forms submitted for review',
  ADMIN_REVIEW: 'Admin reviews renewal process forms',
  FORMS_SENT_BACK: 'Renewal process forms sent back to vendor',
  VENDOR_REVISION: 'Complete renewal forms / provide revisions',
  FINAL_VERIFICATION: 'Admin final verification',
  RENEWAL_COMPLETED: 'Product renewal completed',
  CERTIFICATE_PUBLISHED: RENEWAL_NEXT_ACTIVITY.CERTIFICATE_PUBLISHED,
} as const;

/** payment_details.paymentStatus for renew rows. */
export const RENEW_PAYMENT_STATUS = {
  CREATED: 0,
  SUBMITTED: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

export type RenewActivityTip = {
  activity: string;
  /** 0 = Pending, 1 = Done */
  status: 0 | 1;
  responsibility: string;
  next_activity?: string;
  next_responsibility?: string;
};

export type RenewActivityStatePhase =
  | 'cycle_started_no_payment'
  | 'payment_generated_unpaid'
  | 'payment_rejected_resubmit'
  | 'payment_submitted'
  | 'payment_approved_forms'
  | 'forms_under_review'
  | 'vendor_revision'
  | 'final_verification'
  | 'renewal_completed'
  | 'unknown';

export type RenewActivityState = {
  phase: RenewActivityStatePhase;
  completed: RenewActivityTip | null;
  current: RenewActivityTip | null;
  next: RenewActivityTip | null;
  urnStatus: number;
  paymentStatus: number | null;
};

export type ResolveRenewalActivityStateInput = {
  urnStatus: number;
  /** null when no renew payment_details row for this cycle */
  paymentStatus: number | null;
  /** products.productRenewStatus — 2 = renewed */
  productRenewStatus?: number | null;
};

function tip(
  activity: string,
  status: 0 | 1,
  responsibility: string,
  next?: { activity: string; responsibility: string },
): RenewActivityTip {
  return {
    activity,
    status,
    responsibility,
    next_activity: next?.activity,
    next_responsibility: next?.responsibility,
  };
}

/**
 * Resolve Completed / Current / Next for Renewal Quick View from business state.
 * Prefer payment_details.paymentStatus when urnStatus alone is ambiguous (e.g. 12).
 * Does not use latest activity_log Pending tip.
 */
export function resolveRenewalActivityState(
  input: ResolveRenewalActivityStateInput,
): RenewActivityState {
  const urnStatus = Number(input.urnStatus);
  const paymentStatus =
    input.paymentStatus == null || !Number.isFinite(Number(input.paymentStatus))
      ? null
      : Number(input.paymentStatus);
  const productRenewStatus = Number(input.productRenewStatus ?? NaN);

  const base = {
    urnStatus,
    paymentStatus,
  };

  // Terminal renewal complete (urnStatus 11 overlaps initial cert — require renew markers).
  const isRenewComplete =
    urnStatus === RENEWAL_URN_STATUS.COMPLETED &&
    (productRenewStatus === 2 ||
      paymentStatus === RENEW_PAYMENT_STATUS.APPROVED);

  if (isRenewComplete) {
    return {
      ...base,
      phase: 'renewal_completed',
      completed: tip(RENEWAL_ACTIVITY_UI.RENEWAL_COMPLETED, 1, 'Admin'),
      current: tip(RENEWAL_ACTIVITY_UI.CERTIFICATE_PUBLISHED, 1, 'Admin'),
      next: null,
    };
  }

  if (urnStatus === RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING) {
    return {
      ...base,
      phase: 'final_verification',
      completed: tip(RENEWAL_ACTIVITY_UI.FORMS_SUBMITTED, 1, 'Vendor'),
      current: tip(RENEWAL_ACTIVITY_UI.FINAL_VERIFICATION, 0, 'Admin', {
        activity: RENEWAL_ACTIVITY_UI.RENEWAL_COMPLETED,
        responsibility: 'Admin',
      }),
      next: tip(RENEWAL_ACTIVITY_UI.RENEWAL_COMPLETED, 0, 'Admin'),
    };
  }

  if (urnStatus === RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING) {
    return {
      ...base,
      phase: 'vendor_revision',
      completed: tip(RENEWAL_ACTIVITY_UI.FORMS_SENT_BACK, 1, 'Admin'),
      current: tip(RENEWAL_ACTIVITY_UI.VENDOR_REVISION, 0, 'Manufacturer', {
        activity: RENEWAL_ACTIVITY_UI.ADMIN_REVIEW,
        responsibility: 'Admin',
      }),
      next: tip(RENEWAL_ACTIVITY_UI.ADMIN_REVIEW, 0, 'Admin'),
    };
  }

  if (urnStatus === RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS) {
    return {
      ...base,
      phase: 'forms_under_review',
      completed: tip(RENEWAL_ACTIVITY_UI.FORMS_SUBMITTED, 1, 'Vendor'),
      current: tip(RENEWAL_ACTIVITY_UI.ADMIN_REVIEW, 0, 'Admin', {
        activity: RENEWAL_ACTIVITY_UI.FINAL_VERIFICATION,
        responsibility: 'Admin',
      }),
      next: tip(RENEWAL_ACTIVITY_UI.FINAL_VERIFICATION, 0, 'Admin'),
    };
  }

  // Payment approved (DB or urnStatus) → manufacturer completes forms
  if (
    urnStatus === RENEWAL_URN_STATUS.PAYMENT_APPROVED ||
    paymentStatus === RENEW_PAYMENT_STATUS.APPROVED
  ) {
    return {
      ...base,
      phase: 'payment_approved_forms',
      completed: tip(RENEWAL_ACTIVITY_UI.PAYMENT_APPROVED, 1, 'Admin'),
      current: tip(RENEWAL_ACTIVITY_UI.FORMS_IN_PROGRESS, 0, 'Manufacturer', {
        activity: RENEWAL_ACTIVITY_UI.ADMIN_REVIEW,
        responsibility: 'Admin',
      }),
      next: tip(RENEWAL_ACTIVITY_UI.ADMIN_REVIEW, 0, 'Admin'),
    };
  }

  // Payment submitted / awaiting admin verification
  if (
    urnStatus === RENEWAL_URN_STATUS.PAYMENT_SUBMITTED ||
    paymentStatus === RENEW_PAYMENT_STATUS.SUBMITTED
  ) {
    return {
      ...base,
      phase: 'payment_submitted',
      completed: tip(RENEWAL_ACTIVITY_UI.PAYMENT_SUBMITTED, 1, 'Manufacturer'),
      current: tip(RENEWAL_ACTIVITY_UI.PAYMENT_VERIFICATION, 0, 'Admin', {
        activity: RENEWAL_ACTIVITY_UI.FORMS_IN_PROGRESS,
        responsibility: 'Manufacturer',
      }),
      next: tip(RENEWAL_ACTIVITY_UI.FORMS_IN_PROGRESS, 0, 'Manufacturer'),
    };
  }

  // Rejected payment — manufacturer must pay again (fee still on file)
  if (paymentStatus === RENEW_PAYMENT_STATUS.REJECTED) {
    return {
      ...base,
      phase: 'payment_rejected_resubmit',
      completed: tip(RENEWAL_ACTIVITY_UI.PAYMENT_REJECTED, 1, 'Admin'),
      current: tip(RENEWAL_ACTIVITY_UI.PAYMENT_PENDING, 0, 'Manufacturer', {
        activity: RENEWAL_ACTIVITY_UI.PAYMENT_VERIFICATION,
        responsibility: 'Admin',
      }),
      next: tip(RENEWAL_ACTIVITY_UI.PAYMENT_VERIFICATION, 0, 'Admin'),
    };
  }

  // Fee generated, manufacturer must pay (urnStatus typically still 12)
  if (paymentStatus === RENEW_PAYMENT_STATUS.CREATED) {
    return {
      ...base,
      phase: 'payment_generated_unpaid',
      completed: tip(RENEWAL_ACTIVITY_UI.PAYMENT_GENERATED, 1, 'Admin'),
      current: tip(RENEWAL_ACTIVITY_UI.PAYMENT_PENDING, 0, 'Manufacturer', {
        activity: RENEWAL_ACTIVITY_UI.PAYMENT_VERIFICATION,
        responsibility: 'Admin',
      }),
      next: tip(RENEWAL_ACTIVITY_UI.PAYMENT_VERIFICATION, 0, 'Admin'),
    };
  }

  // Cycle started, no renew payment row yet
  if (
    urnStatus === RENEWAL_URN_STATUS.PAYMENT_PENDING ||
    (urnStatus >= 12 && urnStatus <= 17 && paymentStatus == null)
  ) {
    return {
      ...base,
      phase: 'cycle_started_no_payment',
      completed: tip(RENEWAL_ACTIVITY_UI.CYCLE_STARTED, 1, 'Admin'),
      current: tip(RENEWAL_ACTIVITY_UI.PAYMENT_GENERATION_PENDING, 0, 'Admin', {
        activity: RENEWAL_ACTIVITY_UI.PAYMENT_PENDING,
        responsibility: 'Manufacturer',
      }),
      next: tip(RENEWAL_ACTIVITY_UI.PAYMENT_PENDING, 0, 'Manufacturer'),
    };
  }

  return {
    ...base,
    phase: 'unknown',
    completed: null,
    current: tip(RENEWAL_ACTIVITY_UI.CYCLE_STARTED, 0, 'Admin'),
    next: tip(RENEWAL_ACTIVITY_UI.PAYMENT_GENERATION_PENDING, 0, 'Admin'),
  };
}
