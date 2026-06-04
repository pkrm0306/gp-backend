import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessRenewWasteManagementDocument = ProcessRenewWasteManagement &
  Document;

@Schema({ collection: 'process_renew_waste_management', timestamps: false })
export class ProcessRenewWasteManagement {
  @Prop({ required: true, unique: true })
  processRenewWasteManagementId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'RenewalCycle' })
  renewalCycleId?: Types.ObjectId;

  @Prop({ required: false })
  wmImplementationDetails?: string;

  @Prop({ required: true, type: Number, default: 0 })
  wmSupportingDocuments: number;

  @Prop({ required: true, type: Number, default: 0 })
  processWasteManagementStatus: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessRenewWasteManagementSchema = SchemaFactory.createForClass(
  ProcessRenewWasteManagement,
);
ProcessRenewWasteManagementSchema.index(
  { urnNo: 1 },
  { unique: true, name: 'uniq_process_renew_waste_management_urn' },
);
