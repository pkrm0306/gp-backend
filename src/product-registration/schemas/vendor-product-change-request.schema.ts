import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorProductChangeRequestDocument = VendorProductChangeRequest &
  Document;

@Schema({ collection: 'vendor_product_change_requests', timestamps: false })
export class VendorProductChangeRequest {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true, index: true })
  vendorId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Manufacturer',
    required: true,
    index: true,
  })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true, trim: true, index: true })
  urnNo: string;

  @Prop({ required: true, trim: true })
  eoiNo: string;

  @Prop({ required: true, trim: true })
  currentName: string;

  @Prop({ required: true, trim: true })
  requestedName: string;

  @Prop({ required: true, trim: true })
  reason: string;

  /** pending | approved | rejected */
  @Prop({ required: true, default: 'pending', index: true })
  status: 'pending' | 'approved' | 'rejected';

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  reviewedBy?: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  reviewedAt?: Date | null;

  @Prop({ trim: true, default: null })
  adminRemarks?: string | null;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const VendorProductChangeRequestSchema = SchemaFactory.createForClass(
  VendorProductChangeRequest,
);

VendorProductChangeRequestSchema.index({
  vendorId: 1,
  urnNo: 1,
  eoiNo: 1,
  status: 1,
  createdDate: -1,
});
