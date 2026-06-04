import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessRenewProductStewardshipDocument =
  ProcessRenewProductStewardship & Document;

@Schema({ collection: 'process_renew_product_stewardship', timestamps: false })
export class ProcessRenewProductStewardship {
  @Prop({ required: true, unique: true })
  processRenewProductStewardshipId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: true, type: Number, default: 0 })
  seaSupportingDocuments: number;

  @Prop({ required: false })
  qualityManagementDetails?: string;

  @Prop({ required: true, type: Number, default: 0 })
  qmSupportingDocuments: number;

  @Prop({ required: false })
  eprImplementedDetails?: string;

  @Prop({ required: false })
  eprGreenPackagingDetails?: string;

  @Prop({ required: true, type: Number, default: 0 })
  eprSupportingDocuments: number;

  @Prop({ required: true, type: Number, default: 0 })
  productStewardshipStatus: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessRenewProductStewardshipSchema = SchemaFactory.createForClass(
  ProcessRenewProductStewardship,
);
ProcessRenewProductStewardshipSchema.index(
  { urnNo: 1 },
  { unique: true, name: 'uniq_process_renew_product_stewardship_urn' },
);
