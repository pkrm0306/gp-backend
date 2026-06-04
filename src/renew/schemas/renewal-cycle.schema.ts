import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RenewalCycleDocument = RenewalCycle & Document;

export enum RenewalCycleStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ collection: 'renewal_cycles', timestamps: false })
export class RenewalCycle {
  @Prop({ required: true, index: true })
  urnNo: string;

  @Prop({ required: true })
  cycleNo: number;

  @Prop()
  paymentId?: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(RenewalCycleStatus),
    default: RenewalCycleStatus.IN_PROGRESS,
  })
  status: RenewalCycleStatus;

  @Prop()
  urnStatusAtStart?: number;

  @Prop({ required: true })
  startedAt: Date;

  @Prop()
  completedAt?: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  updatedBy: Types.ObjectId;
}

export const RenewalCycleSchema = SchemaFactory.createForClass(RenewalCycle);
RenewalCycleSchema.index(
  { urnNo: 1, cycleNo: 1 },
  { unique: true, name: 'uniq_renewal_cycle_urn_cycle' },
);
RenewalCycleSchema.index(
  { urnNo: 1, status: 1 },
  { name: 'idx_renewal_cycle_urn_status' },
);
