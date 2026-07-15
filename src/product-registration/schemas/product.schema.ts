import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products' })
export class Product {
  @Prop({ required: true, unique: true })
  productId: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true })
  eoiNo: string;

  /** Numeric suffix aligned with eoiNo (last 3 digits). */
  @Prop()
  eoiSequence?: number;

  /** Previous eoiNo before reassignment on restore / undo-delete. */
  @Prop()
  previousEoiNo?: string;

  @Prop({ type: Date })
  eoiReassignedAt?: Date;

  @Prop({ type: Date })
  rejectedAt?: Date;

  @Prop({ required: true })
  urnNo: string;

  /** Set when this EOI was moved from another URN via admin merge. */
  @Prop()
  mergedFromUrnNo?: string;

  @Prop({ required: true })
  productName: string;

  @Prop()
  productImage?: string;

  @Prop({ required: true, default: 0 })
  plantCount: number;

  @Prop()
  productDetails?: string;

  @Prop()
  productPassport?: string;

  @Prop({ default: 0 })
  productType: number;

  @Prop({ default: 0 })
  productStatus: number;

  @Prop({ default: 0 })
  productRenewStatus: number;

  /** 1-based renewal cycle number (matches `renewal_cycles.cycleNo` for this URN). */
  @Prop()
  renewCycleNo?: number;

  @Prop()
  renewedDate?: Date;

  @Prop({ default: 0 })
  urnStatus: number;

  @Prop()
  assessmentReportUrl?: string;

  @Prop()
  rejectedDetails?: string;

  @Prop()
  certifiedDate?: Date;

  @Prop()
  validtillDate?: Date;

  @Prop()
  firstNotifyDate?: Date;

  @Prop()
  secondNotifyDate?: Date;

  @Prop()
  thirdNotifyDate?: Date;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;

  /** Soft delete — excluded from active listings and EOI sequence calculation */
  @Prop({ default: false })
  is_deleted?: boolean;

  @Prop({ type: Date, default: null })
  deleted_at?: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  deleted_by?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  addedByAdminId?: Types.ObjectId;

  @Prop({ type: Date, default: null })
  discontinuedAt?: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  discontinuedBy?: Types.ObjectId | null;

  @Prop()
  discontinueReason?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Unified lifecycle listing indexes
ProductSchema.index({ productStatus: 1 });
ProductSchema.index({ productType: 1 });
ProductSchema.index({ manufacturerId: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ createdDate: -1 });
ProductSchema.index({ validtillDate: 1 });
ProductSchema.index({ urnNo: 1, is_deleted: 1, productStatus: 1 });
ProductSchema.index({ urnNo: 1, eoiNo: 1 });
ProductSchema.index({ manufacturerId: 1, is_deleted: 1, createdDate: 1 });
ProductSchema.index({ manufacturerId: 1, is_deleted: 1, eoiNo: 1 });
ProductSchema.index({ manufacturerId: 1, productStatus: 1, is_deleted: 1 });
ProductSchema.index({ vendorId: 1, is_deleted: 1, productStatus: 1, createdDate: -1 });
ProductSchema.index({ vendorId: 1, is_deleted: 1, urnNo: 1 });

/** Admin dashboard aggregations / activity center */
ProductSchema.index({ is_deleted: 1, productStatus: 1, createdDate: -1 });
ProductSchema.index({ is_deleted: 1, productStatus: 1, urnStatus: 1 });
ProductSchema.index({ is_deleted: 1, productStatus: 1, validtillDate: 1 });
ProductSchema.index({
  is_deleted: 1,
  categoryId: 1,
  manufacturerId: 1,
  productStatus: 1,
});
