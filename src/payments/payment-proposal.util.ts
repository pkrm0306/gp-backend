/**
 * Vendor registration-fee proposal approval — response shaping and legacy defaults.
 */

export type PaymentProposalLike = {
  vendorProposalApprovalStatus?: number | null;
  vendor_proposal_approval_status?: number | null;
  proposalRejectionRemarks?: string | null;
  proposal_rejection_remarks?: string | null;
  paymentRejectionRemarks?: string | null;
  payment_rejection_remarks?: string | null;
  adminPaymentRejectionRemarks?: string | null;
  admin_payment_rejection_remarks?: string | null;
  paymentStatus?: number | null;
  proposalFile?: string | null;
};

function resolvePaymentRejectionRemarks(
  payment: PaymentProposalLike,
): string | null {
  const raw =
    payment.paymentRejectionRemarks ??
    payment.payment_rejection_remarks ??
    payment.adminPaymentRejectionRemarks ??
    payment.admin_payment_rejection_remarks ??
    null;
  if (raw === undefined || raw === null) {
    return null;
  }
  const trimmed = String(raw).trim();
  return trimmed || null;
}

/** Effective approval status including legacy rows without the column. */
export function resolveVendorProposalApprovalStatus(
  payment: PaymentProposalLike,
): number {
  const raw =
    payment.vendorProposalApprovalStatus ??
    payment.vendor_proposal_approval_status;
  if (raw !== undefined && raw !== null && Number.isFinite(Number(raw))) {
    return Number(raw);
  }

  const paymentStatus = Number(payment.paymentStatus ?? 0);
  if (paymentStatus === 1 || paymentStatus === 2) {
    return 1;
  }
  if (paymentStatus === 0 && String(payment.proposalFile ?? '').trim()) {
    return 0;
  }
  return 0;
}

export function formatPaymentRecord<T extends Record<string, unknown>>(
  payment: T,
): T & {
  vendorProposalApprovalStatus: number;
  vendor_proposal_approval_status: number;
  proposalRejectionRemarks: string | null;
  proposal_rejection_remarks: string | null;
  paymentRejectionRemarks: string | null;
  payment_rejection_remarks: string | null;
  adminPaymentRejectionRemarks: string | null;
  admin_payment_rejection_remarks: string | null;
} {
  const vendorProposalApprovalStatus =
    resolveVendorProposalApprovalStatus(payment);
  const proposalRejectionRemarks =
    (payment.proposalRejectionRemarks ??
      payment.proposal_rejection_remarks ??
      null) as string | null;
  const paymentRejectionRemarks = resolvePaymentRejectionRemarks(payment);

  return {
    ...payment,
    vendorProposalApprovalStatus,
    vendor_proposal_approval_status: vendorProposalApprovalStatus,
    proposalRejectionRemarks,
    proposal_rejection_remarks: proposalRejectionRemarks,
    paymentRejectionRemarks,
    payment_rejection_remarks: paymentRejectionRemarks,
    adminPaymentRejectionRemarks: paymentRejectionRemarks,
    admin_payment_rejection_remarks: paymentRejectionRemarks,
  };
}

export function formatPaymentRecords(
  payments: Record<string, unknown>[] | null | undefined,
): ReturnType<typeof formatPaymentRecord>[] {
  if (!Array.isArray(payments)) {
    return [];
  }
  return payments.map((p) => formatPaymentRecord(p));
}
