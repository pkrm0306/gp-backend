import { BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';
import {
  assertRenewActorCanEditUrn,
  assertRenewActorCanReadUrn,
  RenewUrnContext,
} from '../helpers/renew-common.util';

/** Vendor JWT ownership check; renew data is always stored by URN. */
export async function assertRenewProcessActorForUrn(
  productModel: Model<ProductDocument>,
  user: { vendorId?: string; manufacturerId?: string },
  urnNo: string,
): Promise<RenewUrnContext> {
  if (!urnNo?.trim()) {
    throw new BadRequestException('urnNo is required');
  }
  const actorId = user?.vendorId ?? user?.manufacturerId ?? null;
  return assertRenewActorCanEditUrn(productModel, urnNo, actorId);
}

/** Vendor JWT ownership check for read-only renew GETs (certified browse, locked review). */
export async function assertRenewProcessActorCanReadUrn(
  productModel: Model<ProductDocument>,
  user: { vendorId?: string; manufacturerId?: string },
  urnNo: string,
): Promise<RenewUrnContext> {
  if (!urnNo?.trim()) {
    throw new BadRequestException('urnNo is required');
  }
  const actorId = user?.vendorId ?? user?.manufacturerId ?? null;
  return assertRenewActorCanReadUrn(productModel, urnNo, actorId);
}
