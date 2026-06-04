import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessRenewPpTestReportDocument = ProcessRenewPpTestReport & Document;

@Schema({ collection: 'process_renew_pp_test_reports', timestamps: false })
export class ProcessRenewPpTestReport {
  @Prop({ required: true, unique: true })
  processRenewProductPerformanceTestReportId: number;

  @Prop({ required: true, index: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'RenewalCycle', required: true, index: true })
  renewalCycleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true })
  processRenewProductPerformanceId: number;

  @Prop()
  eoiNo?: string;

  @Prop({ default: '' })
  productName: string;

  @Prop({ default: '' })
  testReportFileName: string;

  @Prop({ default: '' })
  normalizedProductName: string;

  @Prop({ default: '' })
  normalizedTestReportFileName: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessRenewPpTestReportSchema = SchemaFactory.createForClass(
  ProcessRenewPpTestReport,
);
ProcessRenewPpTestReportSchema.index(
  {
    urnNo: 1,
    renewalCycleId: 1,
    normalizedProductName: 1,
    normalizedTestReportFileName: 1,
    eoiNo: 1,
  },
  { name: 'uniq_renew_pp_test_report_per_cycle_row' },
);
