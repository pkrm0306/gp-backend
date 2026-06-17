import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessProductStewardshipDocument = ProcessProductStewardship &
  Document;

@Schema({ collection: 'process_product_stewardship', timestamps: false })
export class ProcessProductStewardship {
  @Prop({ required: true, unique: true })
  processProductStewardshipId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: false, type: Number, default: null })
  seaSupportingDocuments?: number | null; // 0=No File Available, 1=File Available

  @Prop({ required: false })
  qualityManagementDetails?: string;

  @Prop({ required: false, type: Number, default: null })
  qmSupportingDocuments?: number | null; // 0=No File Available, 1=File Available

  @Prop({ required: false })
  eprImplementedDetails?: string;

  @Prop({ required: false })
  eprGreenPackagingDetails?: string;

  @Prop({ required: false, type: Number, default: null })
  eprSupportingDocuments?: number | null; // 0=No File Available, 1=File Available

  @Prop({ required: true, type: Number, default: 0 })
  productStewardshipStatus: number; // 0=Pending, 1=Completed

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessProductStewardshipSchema = SchemaFactory.createForClass(
  ProcessProductStewardship,
);
ProcessProductStewardshipSchema.index(
  { urnNo: 1 },
  { unique: true, name: 'uniq_process_product_stewardship_urn' },
);
