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

  @Prop({ required: true, type: Number, default: 0 })
  /** Count of uploaded test report files (0 = none on last save without files). */
  testReportFiles: number;

  @Prop({
    type: [
      {
        productName: { type: String },
        testReportFileName: { type: String },
      },
    ],
    default: [],
    required: false,
  })
  testReports?: Array<{
    productName?: string;
    testReportFileName: string;
  }>;

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
ProductPerformanceSchema.index(
  { urnNo: 1, vendorId: 1 },
  { unique: true, name: 'uniq_product_performance_per_vendor_urn' },
);
