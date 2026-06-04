import { BadRequestException } from '@nestjs/common';
import {
  RENEWAL_URN_STATUS,
  getRenewalUrnStatusLabel,
} from '../constants/renewal-urn-status.constants';

export type RenewUrnStatusActor = 'vendor' | 'admin';

const VENDOR_TRANSITIONS: Record<number, number[]> = {
  [RENEWAL_URN_STATUS.PAYMENT_APPROVED]: [RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS],
  [RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING]: [
    RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS,
  ],
};

const ADMIN_TRANSITIONS: Record<number, number[]> = {
  [RENEWAL_URN_STATUS.PAYMENT_SUBMITTED]: [RENEWAL_URN_STATUS.PAYMENT_APPROVED],
  [RENEWAL_URN_STATUS.CHECK_PROCESS_FORMS]: [
    RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING,
    RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
  ],
  [RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING]: [RENEWAL_URN_STATUS.COMPLETED],
};

export function getAllowedRenewUrnStatusTargets(
  actor: RenewUrnStatusActor,
  currentStatus: number,
): number[] {
  const map = actor === 'vendor' ? VENDOR_TRANSITIONS : ADMIN_TRANSITIONS;
  return map[currentStatus] ?? [];
}

export function assertRenewUrnStatusTransition(
  actor: RenewUrnStatusActor,
  currentStatus: number,
  targetStatus: number,
): void {
  if (currentStatus === targetStatus) {
    return;
  }

  const allowed = getAllowedRenewUrnStatusTargets(actor, currentStatus);
  if (!allowed.includes(targetStatus)) {
    const allowedLabels = allowed.map(
      (s) => `${s} (${getRenewalUrnStatusLabel(s)})`,
    );
    throw new BadRequestException(
      `Invalid renewal URN transition from ${currentStatus} (${getRenewalUrnStatusLabel(currentStatus)}) to ${targetStatus} (${getRenewalUrnStatusLabel(targetStatus)}). ` +
        `Allowed targets for ${actor}: ${allowedLabels.length ? allowedLabels.join(', ') : 'none'}`,
    );
  }
}

export function assertVendorCannotSetRenewStatus(targetStatus: number): void {
  const forbidden: number[] = [
    RENEWAL_URN_STATUS.PAYMENT_PENDING,
    RENEWAL_URN_STATUS.PAYMENT_SUBMITTED,
    RENEWAL_URN_STATUS.FINAL_VERIFICATION_PENDING,
    RENEWAL_URN_STATUS.COMPLETED,
  ];
  if (forbidden.includes(targetStatus)) {
    throw new BadRequestException(
      `Vendors cannot set renewal urnStatus to ${targetStatus} (${getRenewalUrnStatusLabel(targetStatus)})`,
    );
  }
}
