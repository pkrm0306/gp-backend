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

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: true })
  productName: string;

  @Prop()
  productImage?: string;

  @Prop({ required: true, default: 0 })
  plantCount: number;

  @Prop()
  productDetails?: string;

  @Prop({ default: 0 })
  productType: number;

  @Prop({ default: 0 })
  productStatus: number;

  @Prop({ default: 0 })
  productRenewStatus: number;

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
}

export const ProductSchema = SchemaFactory.createForClass(Product);
