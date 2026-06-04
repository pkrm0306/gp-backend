import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductStatusAuditDocument = ProductStatusAudit & Document;

@Schema({ collection: 'product_status_audits', timestamps: false })
export class ProductStatusAudit {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: true })
  fromStatus: number;

  @Prop({ required: true })
  toStatus: number;

  @Prop()
  reason?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  changedBy: Types.ObjectId;

  @Prop({ required: true })
  changedAt: Date;
}

export const ProductStatusAuditSchema =
  SchemaFactory.createForClass(ProductStatusAudit);

ProductStatusAuditSchema.index({ productId: 1, changedAt: -1 });
ProductStatusAuditSchema.index({ urnNo: 1, changedAt: -1 });
