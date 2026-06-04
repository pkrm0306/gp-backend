import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessRenewCommentsDocument = ProcessRenewComments & Document;

@Schema({ collection: 'process_renew_comments', timestamps: false })
export class ProcessRenewComments {
  @Prop({ required: true, unique: true })
  processRenewCommentsId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  renewalCycleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: false })
  productDesign?: string;

  @Prop({ required: false })
  productPerformance?: string;

  @Prop({ required: false })
  manfacturingProcess?: string;

  @Prop({ required: false })
  wasteManagement?: string;

  @Prop({ required: false })
  lifeCycleApproach?: string;

  @Prop({ required: false })
  productStewardship?: string;

  @Prop({ required: false })
  productInnovation?: string;

  @Prop({ required: false })
  rawMaterials31?: string;

  @Prop({ required: false })
  rawMaterials32?: string;

  @Prop({ required: false })
  rawMaterials33?: string;

  @Prop({ required: false })
  rawMaterials34?: string;

  @Prop({ required: false })
  rawMaterials35?: string;

  @Prop({ required: false })
  rawMaterials36?: string;

  @Prop({ required: false })
  rawMaterials37?: string;

  @Prop({ required: false })
  rawMaterials38?: string;

  @Prop({ required: false })
  rawMaterials39?: string;

  @Prop({ required: false })
  rawMaterials310?: string;

  @Prop({ required: false })
  rawMaterials311?: string;

  @Prop({ required: false })
  rawMaterials312?: string;

  @Prop({ required: false })
  rawMaterials313?: string;

  @Prop({ required: false })
  rawMaterials314?: string;

  @Prop({ required: false })
  rawMaterials315?: string;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessRenewCommentsSchema =
  SchemaFactory.createForClass(ProcessRenewComments);
ProcessRenewCommentsSchema.index(
  { urnNo: 1, renewalCycleId: 1 },
  { unique: true, name: 'uniq_process_renew_comments_urn_cycle' },
);
