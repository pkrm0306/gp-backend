import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ProductDocument } from '../../product-registration/schemas/product.schema';

/** Vendor lock when URN is submitted for review (`products.urnStatus === 4`). */
export const VENDOR_URN_REVIEW_LOCK_STATUS = 4;

export const VENDOR_URN_REVIEW_LOCK_MESSAGE =
  'This URN is submitted for review and cannot be edited.';

export async function assertVendorCanEditUrn(
  productModel: Model<ProductDocument>,
  vendorId: string,
  urnNo: string,
): Promise<void> {
  if (!Types.ObjectId.isValid(vendorId)) {
    throw new ForbiddenException('Vendor ID not found in token');
  }
  const trimmedUrn = urnNo.trim();
  const vendorObjectId = new Types.ObjectId(vendorId);
  const product = await productModel
    .findOne({ urnNo: trimmedUrn, vendorId: vendorObjectId })
    .select('urnStatus urnNo')
    .lean()
    .exec();

  if (!product) {
    const exists = await productModel
      .findOne({ urnNo: trimmedUrn })
      .select('_id')
      .lean()
      .exec();
    if (!exists) {
      throw new NotFoundException('URN not found');
    }
    throw new ForbiddenException(
      'Authenticated vendor does not own this URN',
    );
  }

  if (Number(product.urnStatus) === VENDOR_URN_REVIEW_LOCK_STATUS) {
    throw new ForbiddenException(VENDOR_URN_REVIEW_LOCK_MESSAGE);
  }
}
