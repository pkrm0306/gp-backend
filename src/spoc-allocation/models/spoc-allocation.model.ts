import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SpocAllocationDocument = SpocAllocation & Document;

/**
 * Active/inactive SPOC assignment for a product (EOI), keyed by business `productId`.
 * Isolated from Product schema — do not embed on `products`.
 */
@Schema({
  collection: 'spoc_allocations',
  timestamps: { createdAt: false, updatedAt: 'updatedAt' },
})
export class SpocAllocation {
  /** Business product id (`products.productId`), not Mongo `_id`. */
  @Prop({ required: true, index: true })
  productId: number;

  @Prop({ required: true, trim: true, index: true })
  urn: string;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true, index: true })
  vendorId: Types.ObjectId;

  /** Staff / team member (`VendorUser` with type staff). */
  @Prop({ type: Types.ObjectId, ref: 'VendorUser', required: true, index: true })
  spocId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'VendorUser', required: true })
  assignedBy: Types.ObjectId;

  @Prop({ type: Date, required: true, default: () => new Date() })
  assignedAt: Date;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ required: true, default: true, index: true })
  isActive: boolean;
}

export const SpocAllocationSchema = SchemaFactory.createForClass(SpocAllocation);

/** At most one active allocation per product. */
SpocAllocationSchema.index(
  { productId: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
    name: 'spoc_allocations_productId_active_unique',
  },
);

SpocAllocationSchema.index(
  { urn: 1, isActive: 1 },
  { name: 'spoc_allocations_urn_isActive' },
);

SpocAllocationSchema.index(
  { spocId: 1, isActive: 1 },
  { name: 'spoc_allocations_spocId_isActive' },
);

SpocAllocationSchema.index(
  { vendorId: 1, isActive: 1 },
  { name: 'spoc_allocations_vendorId_isActive' },
);

SpocAllocationSchema.index(
  { assignedAt: -1 },
  { name: 'spoc_allocations_assignedAt_desc' },
);
