import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessWasteManagementDocument = ProcessWasteManagement & Document;

@Schema({ collection: 'process_waste_management', timestamps: false })
export class ProcessWasteManagement {
  @Prop({ required: true, unique: true })
  processWasteManagementId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: false })
  wmImplementationDetails?: string;

  @Prop({ required: true, type: Number, default: 0 })
  wmSupportingDocuments: number; // 0=No File Available, 1=File Available

  @Prop({ required: true, type: Number, default: 0 })
  processWasteManagementStatus: number; // 0=Pending, 1=Completed

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessWasteManagementSchema = SchemaFactory.createForClass(
  ProcessWasteManagement,
);
