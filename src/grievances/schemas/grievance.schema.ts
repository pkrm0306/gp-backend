import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  GRIEVANCE_ID_COUNTER_KEY,
  GrievanceIdCounter,
} from './grievance-id-counter.schema';

export type GrievanceDocument = Grievance & Document;

export enum GrievanceStatus {
  Pending = 'Pending',
  Responded = 'Responded',
  Closed = 'Closed',
}

@Schema({ collection: 'grievances', timestamps: true })
export class Grievance {
  /** Auto-generated as GRV-000001, GRV-000002, … */
  @Prop({ type: String, unique: true, index: true })
  grievanceNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true, index: true })
  vendorId: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  category: string;

  @Prop({ type: String, required: true })
  subject: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: false })
  attachment?: string;

  @Prop({
    type: String,
    enum: Object.values(GrievanceStatus),
    default: GrievanceStatus.Pending,
    index: true,
  })
  status: GrievanceStatus;

  @Prop({ type: String, required: false, default: '' })
  adminResponse?: string;

  @Prop({ type: Types.ObjectId, required: false, default: null })
  respondedBy?: Types.ObjectId | null;

  @Prop({ type: Date, required: false, default: null })
  respondedAt?: Date | null;
}

export const GrievanceSchema = SchemaFactory.createForClass(Grievance);

GrievanceSchema.index({ vendorId: 1, status: 1 });
GrievanceSchema.index({ vendorId: 1, createdAt: -1 });

/**
 * Assigns grievanceNo (GRV-000001 …) on first save via an atomic counter.
 */
GrievanceSchema.pre('save', async function (next) {
  if (!this.isNew || this.grievanceNo) {
    return next();
  }

  try {
    const CounterModel = this.db.model(GrievanceIdCounter.name);
    const counter = await CounterModel.findOneAndUpdate(
      { _id: GRIEVANCE_ID_COUNTER_KEY },
      { $inc: { seq: 1 } },
      { upsert: true, new: true },
    );

    this.grievanceNo = `GRV-${String(counter.seq).padStart(6, '0')}`;
    next();
  } catch (err) {
    next(err as Error);
  }
});
