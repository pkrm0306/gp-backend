import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessRenewProductPerformanceDocument =
  ProcessRenewProductPerformance & Document;

@Schema({ collection: 'process_renew_product_performance', timestamps: false })
export class ProcessRenewProductPerformance {
  @Prop({ required: true, unique: true })
  processRenewProductPerformanceId: number;

  @Prop({ required: true, index: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'RenewalCycle', required: true, index: true })
  renewalCycleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  /** @deprecated Legacy per-EOI rows; new saves use cycle-level header only */
  @Prop()
  eoiNo?: string;

  @Prop()
  productName?: string;

  @Prop()
  testReportFileName?: string;

  @Prop({
    type: [
      {
        productName: { type: String },
        testReportFileName: { type: String },
        eoiNo: { type: String },
      },
    ],
    default: [],
  })
  testReports?: Array<{
    productName?: string;
    testReportFileName?: string;
    eoiNo?: string;
  }>;

  @Prop({ required: true, type: Number, default: 0 })
  testReportFiles: number;

  @Prop({ required: true, type: Number, default: 0 })
  renewalType: number;

  @Prop({ required: true, type: Number, default: 0 })
  productPerformanceStatus: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessRenewProductPerformanceSchema = SchemaFactory.createForClass(
  ProcessRenewProductPerformance,
);
ProcessRenewProductPerformanceSchema.index(
  { urnNo: 1, renewalCycleId: 1 },
  { unique: true, name: 'uniq_process_renew_pp_urn_cycle' },
);
