import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CronEmailLogDocument = CronEmailLog & Document;

export const CRON_JOB_TYPES = [
  'before2month',
  'weeklyMail',
  'deactivationMail',
] as const;

export type CronJobType = (typeof CRON_JOB_TYPES)[number];

@Schema({ collection: 'cron_email_logs', timestamps: false })
export class CronEmailLog {
  @Prop({ required: true, type: Number })
  productId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop()
  eoiNo?: string;

  @Prop({ required: true, enum: CRON_JOB_TYPES })
  jobType: CronJobType;

  @Prop()
  notifyDate?: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop()
  renewCycleNo?: number;

  @Prop()
  urnStatus?: number;

  @Prop()
  productRenewStatus?: number;

  @Prop({ type: Types.ObjectId })
  renewalCycleId?: Types.ObjectId;

  @Prop({ required: true })
  sentAt: Date;
}

export const CronEmailLogSchema = SchemaFactory.createForClass(CronEmailLog);

CronEmailLogSchema.index(
  { productId: 1, jobType: 1, notifyDate: 1 },
  { unique: true, name: 'uniq_cron_email_log_product_job_date' },
);
