import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessRenewInnovationDocument = ProcessRenewInnovation & Document;

@Schema({ collection: 'process_renew_innovation', timestamps: false })
export class ProcessRenewInnovation {
  @Prop({ required: true, unique: true })
  processRenewInnovationId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'RenewalCycle' })
  renewalCycleId?: Types.ObjectId;

  @Prop({ required: false })
  innovationImplementationDetails?: string;

  @Prop({ required: true, type: Number, default: 0 })
  innovationImplementationDocuments: number;

  @Prop({ required: true, type: Number, default: 0 })
  processInnovationStatus: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessRenewInnovationSchema = SchemaFactory.createForClass(
  ProcessRenewInnovation,
);
ProcessRenewInnovationSchema.index(
  { urnNo: 1, renewalCycleId: 1 },
  { unique: true, name: 'uniq_process_renew_innovation_urn_cycle' },
);
