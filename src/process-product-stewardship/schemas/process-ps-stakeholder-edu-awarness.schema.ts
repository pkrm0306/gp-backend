import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessPsStakeholderEduAwarnessDocument =
  ProcessPsStakeholderEduAwarness & Document;

@Schema({
  collection: 'process_ps_stakeholder_edu_awarness',
  timestamps: false,
})
export class ProcessPsStakeholderEduAwarness {
  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'ProcessProductStewardship',
    required: true,
  })
  processProductStewardshipId: Types.ObjectId;

  @Prop({ default: '' })
  seaProgramDetails: string;

  @Prop({ default: '' })
  seaNoOfPrograms: string;

  @Prop({ type: Number, default: null, required: false })
  seaSupportingDocuments?: number | null;

  @Prop({ type: Number, default: 0 })
  productStewardshipStatus: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const ProcessPsStakeholderEduAwarnessSchema = SchemaFactory.createForClass(
  ProcessPsStakeholderEduAwarness,
);

ProcessPsStakeholderEduAwarnessSchema.index(
  { urnNo: 1, vendorId: 1, isDeleted: 1 },
  { name: 'idx_ps_stakeholder_urn_vendor_active' },
);
