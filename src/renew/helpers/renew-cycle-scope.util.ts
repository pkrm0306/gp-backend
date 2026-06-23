import { BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  PaymentDetails,
  PaymentDetailsDocument,
} from '../../payments/schemas/payment-details.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
  RenewalCycleStatus,
} from '../schemas/renewal-cycle.schema';
import { RENEWAL_URN_STATUS } from '../constants/renewal-urn-status.constants';
import { formatPaymentRecords } from '../../payments/payment-proposal.util';
import { toRenewObjectId } from './renew-common.util';

export type CycleScopedUrnProductSnapshot = {
  urnStatus?: number | null;
  renewCycleNo?: number | null;
};

export type CycleScopedUrnPaymentSnapshot = {
  paymentStatus?: number | null;
} | null;

/** Minimum urn_status for admin renew process tabs (Product Performance, Manufacturing, …). */
export const RENEW_ADMIN_PROCESS_TAB_UNLOCK_STATUS =
  RENEWAL_URN_STATUS.PAYMENT_APPROVED;

/**
 * Resolve urn_status for a specific renewal cycle (admin tab gating + quick-view).
 * Avoids returning certified status 11 while an in-progress cycle is active.
 */
export function resolveCycleScopedUrnStatus(
  cycle:
    | Pick<RenewalCycleDocument, 'cycleNo' | 'status'>
    | null
    | undefined,
  product: CycleScopedUrnProductSnapshot,
  payment?: CycleScopedUrnPaymentSnapshot,
): number {
  const productStatus = Number(product.urnStatus ?? 0);
  const productCycleNo = Number(product.renewCycleNo ?? 0);

  if (!cycle) {
    return productStatus;
  }

  const cycleNo = Number(cycle.cycleNo ?? 0);
  const paymentStatus = Number(payment?.paymentStatus ?? -1);

  const inferFromPayment = (): number => {
    if (paymentStatus === 2) {
      return RENEWAL_URN_STATUS.PAYMENT_APPROVED;
    }
    if (paymentStatus === 1) {
      return RENEWAL_URN_STATUS.PAYMENT_SUBMITTED;
    }
    return RENEWAL_URN_STATUS.PAYMENT_PENDING;
  };

  if (cycle.status === RenewalCycleStatus.COMPLETED) {
    return RENEWAL_URN_STATUS.COMPLETED;
  }

  if (productCycleNo === cycleNo) {
    if (productStatus === RENEWAL_URN_STATUS.COMPLETED) {
      return RENEWAL_URN_STATUS.PAYMENT_PENDING;
    }
    if (productStatus >= RENEWAL_URN_STATUS.PAYMENT_PENDING) {
      return productStatus;
    }
    return inferFromPayment();
  }

  if (productCycleNo < cycleNo) {
    return inferFromPayment();
  }

  if (productCycleNo > cycleNo) {
    return RENEWAL_URN_STATUS.COMPLETED;
  }

  return inferFromPayment();
}

export function canAdminAccessRenewProcessTabs(urnStatus: number): boolean {
  return (
    urnStatus >= RENEW_ADMIN_PROCESS_TAB_UNLOCK_STATUS ||
    urnStatus === RENEWAL_URN_STATUS.COMPLETED
  );
}

/** Strict renew document filter — current cycle only (no legacy null cycle rows). */
export function buildStrictRenewDocumentsFilter(
  urnNo: string,
  renewalCycleId: Types.ObjectId | string,
): Record<string, unknown> {
  return {
    urnNo: urnNo.trim(),
    isDeleted: { $ne: true },
    renewalCycleId: toRenewObjectId(String(renewalCycleId), 'renewalCycleId'),
  };
}

/** Process header lookup: cycle 1 allows legacy rows without renewalCycleId. */
export function buildRenewProcessHeaderFilter(
  urnNo: string,
  cycle: RenewalCycleDocument | null,
): Record<string, unknown> {
  const trimmed = urnNo.trim();
  if (!cycle?._id) {
    return { urnNo: trimmed };
  }
  const cycleId = cycle._id;
  const cycleIdStr = String(cycleId);
  const cycleIdMatches = [
    { renewalCycleId: cycleId },
    { renewalCycleId: cycleIdStr },
  ];
  if (Number(cycle.cycleNo) > 1) {
    return { urnNo: trimmed, $or: cycleIdMatches };
  }
  return {
    urnNo: trimmed,
    $or: [
      ...cycleIdMatches,
      { renewalCycleId: null },
      { renewalCycleId: { $exists: false } },
    ],
  };
}

/** Resolve renewal cycle for read APIs (list units, quick-view) without payment-edit guards. */
export async function resolveRenewCycleForQuery(
  cycleModel: Model<RenewalCycleDocument>,
  urnNo: string,
  renewalCycleId?: string,
): Promise<RenewalCycleDocument> {
  const trimmed = urnNo.trim();
  const cycleIdHint = String(renewalCycleId ?? '').trim();
  if (cycleIdHint) {
    const cycle = await cycleModel.findById(cycleIdHint).exec();
    if (!cycle || cycle.urnNo !== trimmed) {
      throw new BadRequestException('renewalCycleId does not match this URN');
    }
    return cycle;
  }
  const active = await cycleModel
    .findOne({ urnNo: trimmed, status: RenewalCycleStatus.IN_PROGRESS })
    .exec();
  if (!active) {
    throw new BadRequestException(
      'renewalCycleId is required to load renewal data for this URN',
    );
  }
  return active;
}

export function buildRenewPaymentFindFilter(
  urnNo: string,
  cycle: RenewalCycleDocument,
  vendorId?: Types.ObjectId | string,
): Record<string, unknown> {
  const cycleId = toRenewObjectId(String(cycle._id), 'renewalCycleId');
  const cycleNo = Number(cycle.cycleNo ?? 1);
  const orClause: Record<string, unknown>[] = [{ renewalCycleId: cycleId }];

  /** Legacy cycle-1 rows only — never match untagged payments on cycle 2+. */
  if (cycleNo === 1) {
    if (cycle.paymentId != null) {
      orClause.push({
        renewalCycleId: { $in: [null] },
        paymentId: cycle.paymentId,
      });
      orClause.push({
        renewalCycleId: { $exists: false },
        paymentId: cycle.paymentId,
      });
    }
    if (cycle.paymentId == null) {
      orClause.push({ renewalCycleId: { $exists: false } });
      orClause.push({ renewalCycleId: null });
    }
  }

  const filter: Record<string, unknown> = {
    urnNo: urnNo.trim(),
    paymentType: 'renew',
    $or: orClause,
  };
  if (vendorId) {
    filter.vendorId = toRenewObjectId(String(vendorId), 'vendorId');
  }
  return filter;
}

export async function findRenewPaymentsForCycle(
  paymentModel: Model<PaymentDetailsDocument>,
  urnNo: string,
  cycle: RenewalCycleDocument,
  vendorId?: Types.ObjectId | string,
): Promise<PaymentDetailsDocument[]> {
  return paymentModel
    .find(buildRenewPaymentFindFilter(urnNo, cycle, vendorId))
    .sort({ paymentId: -1 })
    .exec();
}

export function mapRenewPaymentForApi(
  row: PaymentDetailsDocument | Record<string, unknown>,
): Record<string, unknown> {
  const plain =
    typeof (row as PaymentDetailsDocument).toObject === 'function'
      ? (row as PaymentDetailsDocument).toObject()
      : { ...(row as Record<string, unknown>) };
  return {
    paymentId: plain.paymentId,
    urnNo: plain.urnNo,
    paymentType: plain.paymentType,
    renewalCycleId: plain.renewalCycleId
      ? String(plain.renewalCycleId)
      : null,
    paymentStatus: plain.paymentStatus,
    quoteAmount: plain.quoteAmount,
    quoteGstAmount: plain.quoteGstAmount,
    quoteTdsAmount: plain.quoteTdsAmount,
    quoteTotal: plain.quoteTotal,
    totalAmount: plain.quoteTotal,
    paymentMode: plain.paymentMode ?? null,
    paymentReferenceNo: plain.paymentReferenceNo ?? null,
    paymentChequeDate: plain.paymentChequeDate ?? null,
    proposalFile: plain.proposalFile ?? null,
    chequeOrDdFile: plain.chequeOrDdFile ?? null,
    cheque_or_dd_file: plain.chequeOrDdFile ?? null,
    tdsFile: plain.tdsFile ?? null,
    tds_file: plain.tdsFile ?? null,
    paymentRejectionRemarks: plain.paymentRejectionRemarks ?? null,
    payment_rejection_remarks: plain.paymentRejectionRemarks ?? null,
    admin_payment_rejection_remarks: plain.paymentRejectionRemarks ?? null,
    proposalRejectionRemarks: plain.proposalRejectionRemarks ?? null,
    createdAt: plain.createdDate,
    updatedAt: plain.updatedDate,
    createdDate: plain.createdDate,
    updatedDate: plain.updatedDate,
  };
}

export function buildRenewPaymentsPayload(
  rows: Array<PaymentDetailsDocument | Record<string, unknown>>,
): { payments: Record<string, unknown>[]; payment: Record<string, unknown> | null } {
  const mapped = rows.map((row) => mapRenewPaymentForApi(row));
  return {
    payments: mapped,
    payment: mapped.length > 0 ? mapped[0] : null,
  };
}

export async function assertRenewCycleAcceptsPayment(
  cycleModel: Model<RenewalCycleDocument>,
  urnNo: string,
  renewalCycleId: string,
): Promise<RenewalCycleDocument> {
  const cycle = await cycleModel.findById(renewalCycleId.trim()).exec();
  if (!cycle || cycle.urnNo !== urnNo.trim()) {
    throw new BadRequestException(
      'renewalCycleId does not match this URN',
    );
  }
  if (cycle.status !== RenewalCycleStatus.IN_PROGRESS) {
    throw new BadRequestException(
      'Renewal payment can only be created for an in-progress renewal cycle',
    );
  }
  return cycle;
}

export function formatCycleScopedPaymentRecords(
  rows: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return formatPaymentRecords(rows) as Array<Record<string, unknown>>;
}

/** Resolve renewal cycle document for reads/writes (explicit id or active in-progress). */
export async function resolveRenewCycleDocument(
  cycleModel: Model<RenewalCycleDocument>,
  urnNo: string,
  renewalCycleId?: string,
): Promise<RenewalCycleDocument | null> {
  const trimmedUrn = urnNo.trim();
  if (renewalCycleId?.trim()) {
    const cycle = await cycleModel.findById(renewalCycleId.trim()).exec();
    if (!cycle || cycle.urnNo !== trimmedUrn) {
      throw new BadRequestException('renewalCycleId does not match this URN');
    }
    return cycle;
  }
  return cycleModel
    .findOne({ urnNo: trimmedUrn, status: RenewalCycleStatus.IN_PROGRESS })
    .sort({ cycleNo: -1 })
    .exec();
}
