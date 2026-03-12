import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessCommentsDocument = ProcessComments & Document;

@Schema({ collection: 'process_comments', timestamps: false })
export class ProcessComments {
  @Prop({ required: true, unique: true })
  processCommentsId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

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

export const ProcessCommentsSchema = SchemaFactory.createForClass(ProcessComments);
