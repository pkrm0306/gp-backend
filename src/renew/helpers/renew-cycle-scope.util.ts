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
import { formatPaymentRecords } from '../../payments/payment-proposal.util';
import { toRenewObjectId } from './renew-common.util';

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
  if (Number(cycle.cycleNo) > 1) {
    return { urnNo: trimmed, renewalCycleId: cycleId };
  }
  return {
    urnNo: trimmed,
    $or: [
      { renewalCycleId: cycleId },
      { renewalCycleId: null },
      { renewalCycleId: { $exists: false } },
    ],
  };
}

export function buildRenewPaymentFindFilter(
  urnNo: string,
  cycle: RenewalCycleDocument,
  vendorId?: Types.ObjectId | string,
): Record<string, unknown> {
  const cycleId = toRenewObjectId(String(cycle._id), 'renewalCycleId');
  const orClause: Record<string, unknown>[] = [{ renewalCycleId: cycleId }];
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
  if (Number(cycle.cycleNo) === 1 && cycle.paymentId == null) {
    orClause.push({ renewalCycleId: { $exists: false } });
    orClause.push({ renewalCycleId: null });
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
