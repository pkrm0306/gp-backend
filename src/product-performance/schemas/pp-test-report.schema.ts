import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PpTestReportDocument = PpTestReport & Document;

@Schema({ collection: 'process_pp_test_reports', timestamps: false })
export class PpTestReport {
  @Prop({ required: true, unique: true })
  productPerformanceTestReportId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  processProductPerformanceId: number;

  @Prop({ default: '' })
  productName?: string;

  @Prop({ default: '' })
  testReportFileName: string;

  /** Partial rows: only productName or only testReportFileName may be filled (vendor UI). */
  @Prop({ required: false, default: '' })
  normalizedProductName: string;

  @Prop({ required: false, default: '' })
  normalizedTestReportFileName: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const PpTestReportSchema = SchemaFactory.createForClass(PpTestReport);
PpTestReportSchema.index(
  { urnNo: 1, normalizedProductName: 1, normalizedTestReportFileName: 1 },
  {
    unique: true,
    name: 'uniq_pp_test_report_per_urn_normalized_pair',
  },
);
