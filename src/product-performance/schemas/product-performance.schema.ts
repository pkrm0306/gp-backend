import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductPerformanceDocument = ProductPerformance & Document;

@Schema({ collection: 'process_product_performance', timestamps: false })
export class ProductPerformance {
  @Prop({ required: true, unique: true })
  processProductPerformanceId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: false, default: '' })
  eoiNo?: string;

  @Prop({ required: false, default: '' })
  productName?: string;

  @Prop({ required: false, default: '' })
  testReportFileName?: string;

  @Prop({ required: true, type: Number, default: 0 })
  testReportFiles: number; // 0=No File Available, 1=File Available

  @Prop({ required: true, type: Number, default: 0 })
  renewalType: number; // 0=Not Renewed, >0 = Renewed no of times

  @Prop({ required: true, type: Number, default: 0 })
  productPerformanceStatus: number; // 0=Pending, 1=Completed

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProductPerformanceSchema =
  SchemaFactory.createForClass(ProductPerformance);
