import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ProductDocument } from '../../product-registration/schemas/product.schema';
import {
  RenewalCycle,
  RenewalCycleDocument,
  RenewalCycleStatus,
} from '../schemas/renewal-cycle.schema';
import {
  RENEWAL_URN_STATUS,
  RENEW_VENDOR_PROCESS_LOCK_STATUSES,
} from '../constants/renewal-urn-status.constants';
import { matchRenewEligibleProducts } from './renew-eligible-product.util';

export function toRenewObjectId(
  id: string | Types.ObjectId,
  fieldName: string,
): Types.ObjectId {
  if (id instanceof Types.ObjectId) {
    return id;
  }
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`Invalid ${fieldName} format: ${id}`);
  }
  return new Types.ObjectId(id);
}

export const RENEW_UPLOAD_PREFIX = 'renew_urns';

export function renewUploadPath(urnNo: string): string {
  return `${RENEW_UPLOAD_PREFIX}/${urnNo.trim()}`;
}

export type RenewUrnContext = {
  urnNo: string;
  vendorId: Types.ObjectId;
  manufacturerId: Types.ObjectId;
};

/** Resolve vendor + manufacturer from products by URN (renew storage is URN-scoped). */
export async function resolveUrnRenewContext(
  productModel: Model<ProductDocument>,
  urnNo: string,
): Promise<RenewUrnContext> {
  const trimmedUrn = urnNo.trim();
  const product = await productModel
    .findOne({ urnNo: trimmedUrn, ...matchRenewEligibleProducts() })
    .select('vendorId manufacturerId')
    .lean()
    .exec();

  if (!product?.vendorId || !product?.manufacturerId) {
    throw new NotFoundException(
      'No certified products found for this URN (rejected EOIs are excluded from renewal)',
    );
  }

  return {
    urnNo: trimmedUrn,
    vendorId: product.vendorId as Types.ObjectId,
    manufacturerId: product.manufacturerId as Types.ObjectId,
  };
}

/** @deprecated use resolveUrnRenewContext */
export async function resolveUrnOwnerVendorId(
  productModel: Model<ProductDocument>,
  urnNo: string,
): Promise<string> {
  const context = await resolveUrnRenewContext(productModel, urnNo);
  return String(context.vendorId);
}

export function renewOwnershipFields(context: RenewUrnContext): {
  urnNo: string;
  vendorId: Types.ObjectId;
  manufacturerId: Types.ObjectId;
} {
  return {
    urnNo: context.urnNo,
    vendorId: context.vendorId,
    manufacturerId: context.manufacturerId,
  };
}

/** Optional vendor JWT check; returns URN ownership context for reads/writes. */
export async function assertRenewActorCanEditUrn(
  productModel: Model<ProductDocument>,
  urnNo: string,
  actorVendorOrManufacturerId?: string | null,
): Promise<RenewUrnContext> {
  const context = await resolveUrnRenewContext(productModel, urnNo);
  const actorId = actorVendorOrManufacturerId
    ? String(actorVendorOrManufacturerId).trim()
    : '';
  if (actorId) {
    const ownsUrn =
      String(context.vendorId) === actorId ||
      String(context.manufacturerId) === actorId;
    if (!ownsUrn) {
      throw new ForbiddenException('Authenticated user does not own this URN');
    }

    const product = await productModel
      .findOne({ urnNo: context.urnNo, ...matchRenewEligibleProducts() })
      .select('urnStatus')
      .lean()
      .exec();

    const urnStatus = Number(product?.urnStatus);
    if (RENEW_VENDOR_PROCESS_LOCK_STATUSES.has(urnStatus)) {
      throw new ForbiddenException(
        'Renewal process forms are locked while admin is reviewing this URN',
      );
    }
  }
  return context;
}

export async function assertRenewProcessEditable(
  productModel: Model<ProductDocument>,
  renewalCycleModel: Model<RenewalCycleDocument>,
  urnNo: string,
): Promise<{ cycle: RenewalCycleDocument; context: RenewUrnContext }> {
  const context = await resolveUrnRenewContext(productModel, urnNo);

  const product = await productModel
    .findOne({ urnNo: context.urnNo, ...matchRenewEligibleProducts() })
    .select('urnStatus')
    .lean()
    .exec();

  if (!product) {
    throw new NotFoundException(
      'No certified products found for this URN (rejected EOIs are excluded from renewal)',
    );
  }

  const urnStatus = Number(product.urnStatus);
  if (urnStatus < RENEWAL_URN_STATUS.PAYMENT_APPROVED) {
    throw new ForbiddenException(
      'Renewal payment must be approved before editing process forms',
    );
  }

  const editableStatuses: number[] = [
    RENEWAL_URN_STATUS.PAYMENT_APPROVED,
    RENEWAL_URN_STATUS.VENDOR_RESPONSE_PENDING,
  ];
  if (!editableStatuses.includes(urnStatus)) {
    throw new ForbiddenException(
      'Renewal process forms cannot be edited in the current URN status',
    );
  }

  const cycle = await renewalCycleModel
    .findOne({
      urnNo: context.urnNo,
      status: RenewalCycleStatus.IN_PROGRESS,
    })
    .sort({ cycleNo: -1 })
    .exec();

  if (!cycle) {
    throw new ForbiddenException('No active renewal cycle found');
  }

  return { cycle, context };
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const lastDayOfMonth = new Date(
    d.getFullYear(),
    d.getMonth() + 1,
    0,
  ).getDate();
  d.setDate(Math.min(day, lastDayOfMonth));
  return d;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Extend validity by 24 months and normalize to Dec 31 of the resulting year. */
export function extendValidityForRenewal(currentValidTill: Date): Date {
  const extended = addMonths(currentValidTill, 24);
  return startOfDay(new Date(extended.getFullYear(), 11, 31));
}

export type RenewalCycleRef = RenewalCycle & { _id: Types.ObjectId };
