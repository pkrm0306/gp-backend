import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessRenewPsStakeholderEduAwarnessDocument =
  ProcessRenewPsStakeholderEduAwarness & Document;

@Schema({
  collection: 'process_renew_ps_stakeholder_edu_awarness',
  timestamps: false,
})
export class ProcessRenewPsStakeholderEduAwarness {
  @Prop({ required: true, unique: true })
  processRenewPsStakeholderEduAwarnessId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'ProcessRenewProductStewardship',
    required: true,
  })
  processRenewProductStewardshipId: Types.ObjectId;

  @Prop({ default: '' })
  seaProgramDetails: string;

  @Prop({ default: '' })
  seaNoOfPrograms: string;

  @Prop({ type: Number, default: 0 })
  seaSupportingDocuments: number;

  @Prop({ type: Number, default: 0 })
  productStewardshipStatus: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const ProcessRenewPsStakeholderEduAwarnessSchema =
  SchemaFactory.createForClass(ProcessRenewPsStakeholderEduAwarness);

ProcessRenewPsStakeholderEduAwarnessSchema.index(
  { urnNo: 1, vendorId: 1, isDeleted: 1 },
  { name: 'idx_renew_ps_stakeholder_urn_vendor_active' },
);
