import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessLifeCycleApproachDocument = ProcessLifeCycleApproach &
  Document;

@Schema({ collection: 'process_life_cycle_approach', timestamps: false })
export class ProcessLifeCycleApproach {
  @Prop({ required: true, unique: true })
  processLifeCycleApproachId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: false, type: Number, default: 0 })
  lifeCycleAssesmentReports?: number; // 0=No File Available, 1=File Available

  @Prop({ required: false })
  lifeCycleImplementationDetails?: string;

  @Prop({ required: false, type: Number, default: 0 })
  lifeCycleImplementationDocuments?: number; // 0=No File Available, 1=File Available

  @Prop({ required: true, type: Number, default: 0 })
  processLifeCycleApproachStatus: number; // 0=Pending, 1=Completed

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessLifeCycleApproachSchema = SchemaFactory.createForClass(
  ProcessLifeCycleApproach,
);
