import { basename } from 'path';
import { fileMetadataFromMulter } from '../documents/helpers/document-version.helper';
import {
  formatPaymentRecord,
  PaymentProposalLike,
  resolveVendorProposalApprovalStatus,
} from './payment-proposal.util';

export const PAYMENT_REFERENCE_UNIQUE_MESSAGE =
  'Reference Number already exists';

export const PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE =
  'Payment details have already been submitted and cannot be modified while admin review is in progress.';

export const PAYMENT_PROOF_APPROVED_LOCKED_MESSAGE =
  'Approved payment details cannot be modified.';

export type PaymentSubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected';

export type PaymentTdsFileMetadata = {
  originalName: string | null;
  storedName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  filePath: string | null;
};

export function resolvePaymentSubmissionStatus(
  paymentStatus?: number | null,
): {
  submissionStatus: PaymentSubmissionStatus;
  submission_status: PaymentSubmissionStatus;
  submissionStatusLabel: string;
  submission_status_label: string;
} {
  const status = Number(paymentStatus ?? 0);
  if (status === 1) {
    return {
      submissionStatus: 'submitted',
      submission_status: 'submitted',
      submissionStatusLabel: 'Submitted',
      submission_status_label: 'Submitted',
    };
  }
  if (status === 2) {
    return {
      submissionStatus: 'approved',
      submission_status: 'approved',
      submissionStatusLabel: 'Approved',
      submission_status_label: 'Approved',
    };
  }
  if (status === 3) {
    return {
      submissionStatus: 'rejected',
      submission_status: 'rejected',
      submissionStatusLabel: 'Rejected',
      submission_status_label: 'Rejected',
    };
  }
  return {
    submissionStatus: 'draft',
    submission_status: 'draft',
    submissionStatusLabel: 'Not Submitted',
    submission_status_label: 'Not Submitted',
  };
}

/** Registration payments require vendor proposal approval before payment proof fields apply. */
export function isPaymentSubmissionStageActive(
  payment: PaymentProposalLike & { paymentType?: string | null },
): boolean {
  const paymentType = String(payment.paymentType ?? 'registration')
    .trim()
    .toLowerCase();
  const paymentStatus = Number(payment.paymentStatus ?? 0);

  if (paymentStatus >= 1) {
    return true;
  }

  if (paymentType === 'registration') {
    return resolveVendorProposalApprovalStatus(payment) === 1;
  }

  return true;
}

/** Vendor may edit/submit payment proof only in draft, or after admin payment rejection. */
export function isVendorPaymentProofEditable(
  payment: PaymentProposalLike & {
    paymentType?: string | null;
    paymentStatus?: number | null;
  },
): boolean {
  const paymentStatus = Number(payment.paymentStatus ?? 0);
  if (paymentStatus === 3) {
    return true;
  }
  if (paymentStatus === 1 || paymentStatus === 2) {
    return false;
  }

  const paymentType = String(payment.paymentType ?? 'registration')
    .trim()
    .toLowerCase();
  if (paymentType === 'registration') {
    return resolveVendorProposalApprovalStatus(payment) === 1;
  }

  return true;
}

export function resolveVendorPaymentProofLockMessage(
  payment: PaymentProposalLike & { paymentStatus?: number | null },
): string | null {
  const paymentStatus = Number(payment.paymentStatus ?? 0);
  if (paymentStatus === 1) {
    return PAYMENT_PROOF_SUBMITTED_LOCKED_MESSAGE;
  }
  if (paymentStatus === 2) {
    return PAYMENT_PROOF_APPROVED_LOCKED_MESSAGE;
  }
  return null;
}

const PAYMENT_SUBMISSION_MASK_KEYS = [
  'paymentMode',
  'payment_mode',
  'paymentReferenceNo',
  'payment_reference_no',
  'paymentChequeDate',
  'payment_cheque_date',
  'tdsFile',
  'tds_file',
  'chequeOrDdFile',
  'cheque_or_dd_file',
  'tdsFileMetadata',
  'tds_file_metadata',
  'referenceNumberMustBeUnique',
  'reference_number_must_be_unique',
  'referenceNumberUniqueMessage',
  'reference_number_unique_message',
] as const;

export function maskPaymentSubmissionFields<T extends Record<string, unknown>>(
  payment: T,
): T & {
  paymentStageActive: boolean;
  payment_stage_active: boolean;
} {
  const paymentStageActive = isPaymentSubmissionStageActive(payment);
  if (paymentStageActive) {
    return {
      ...payment,
      paymentStageActive: true,
      payment_stage_active: true,
    };
  }

  const masked = { ...payment } as Record<string, unknown>;
  for (const key of PAYMENT_SUBMISSION_MASK_KEYS) {
    if (key in masked) {
      masked[key] = null;
    }
  }

  return {
    ...(masked as T),
    paymentStageActive: false,
    payment_stage_active: false,
  };
}

export function formatPaymentRecordsForUrnDetails(
  payments: Record<string, unknown>[] | null | undefined,
): Array<
  ReturnType<typeof formatPaymentRecord> & {
    paymentStageActive: boolean;
    payment_stage_active: boolean;
    paymentProofEditable: boolean;
    payment_proof_editable: boolean;
    paymentProofLockMessage: string | null;
    payment_proof_lock_message: string | null;
  }
> {
  if (!Array.isArray(payments)) {
    return [];
  }
  return payments.map((payment) => {
    const formatted = formatPaymentRecord(payment);
    const paymentProofEditable = isVendorPaymentProofEditable(formatted);
    const paymentProofLockMessage = resolveVendorPaymentProofLockMessage(formatted);
    return maskPaymentSubmissionFields({
      ...formatted,
      paymentProofEditable,
      payment_proof_editable: paymentProofEditable,
      paymentProofLockMessage,
      payment_proof_lock_message: paymentProofLockMessage,
    });
  });
}

export function buildTdsFileMetadata(
  tdsFile?: string | null,
  versionMetadata?: Partial<PaymentTdsFileMetadata> | null,
): PaymentTdsFileMetadata | null {
  const filePath = String(tdsFile ?? versionMetadata?.filePath ?? '').trim();
  if (!filePath) {
    return null;
  }

  const fallback = fileMetadataFromMulter(
    undefined,
    basename(filePath),
    filePath,
  );

  return {
    originalName: versionMetadata?.originalName ?? fallback.originalName ?? null,
    storedName:
      versionMetadata?.storedName ??
      fallback.storedName ??
      basename(filePath) ??
      null,
    mimeType: versionMetadata?.mimeType ?? fallback.mimeType ?? null,
    sizeBytes:
      versionMetadata?.sizeBytes !== undefined &&
      versionMetadata?.sizeBytes !== null
        ? versionMetadata.sizeBytes
        : fallback.sizeBytes ?? null,
    filePath,
  };
}

export function enrichPaymentByUrnResponse<T extends Record<string, unknown>>(
  payment: T,
  options?: {
    tdsFileMetadata?: PaymentTdsFileMetadata | null;
    referenceNumberMustBeUnique?: boolean;
  },
): T & {
  referenceNumberMustBeUnique: boolean;
  reference_number_must_be_unique: boolean;
  referenceNumberUniqueMessage: string;
  reference_number_unique_message: string;
  tdsFileMetadata: PaymentTdsFileMetadata | null;
  tds_file_metadata: PaymentTdsFileMetadata | null;
  submissionStatus: PaymentSubmissionStatus;
  submission_status: PaymentSubmissionStatus;
  submissionStatusLabel: string;
  submission_status_label: string;
} {
  const formatted = formatPaymentRecord(payment);
  const tdsFile = String(
    formatted.tdsFile ?? formatted.tds_file ?? '',
  ).trim();
  const tdsFileMetadata =
    options?.tdsFileMetadata !== undefined
      ? options.tdsFileMetadata
      : buildTdsFileMetadata(tdsFile);
  const submission = resolvePaymentSubmissionStatus(
    Number(formatted.paymentStatus ?? 0),
  );
  const referenceNumberMustBeUnique =
    options?.referenceNumberMustBeUnique ?? true;
  const paymentProofEditable = isVendorPaymentProofEditable(formatted);
  const paymentProofLockMessage = resolveVendorPaymentProofLockMessage(formatted);

  return maskPaymentSubmissionFields({
    ...formatted,
    referenceNumberMustBeUnique,
    reference_number_must_be_unique: referenceNumberMustBeUnique,
    referenceNumberUniqueMessage: PAYMENT_REFERENCE_UNIQUE_MESSAGE,
    reference_number_unique_message: PAYMENT_REFERENCE_UNIQUE_MESSAGE,
    tdsFileMetadata,
    tds_file_metadata: tdsFileMetadata,
    paymentProofEditable,
    payment_proof_editable: paymentProofEditable,
    paymentProofLockMessage,
    payment_proof_lock_message: paymentProofLockMessage,
    ...submission,
  });
}
