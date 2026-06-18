import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessRenewManufacturingDocument = ProcessRenewManufacturing &
  Document;

@Schema({ collection: 'process_renew_manufacturing', timestamps: false })
export class ProcessRenewManufacturing {
  @Prop({ required: true, unique: true })
  processRenewManufacturingId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'RenewalCycle' })
  renewalCycleId?: Types.ObjectId;

  @Prop({ required: true, type: Number, default: 0 })
  energyConservationSupportingDocuments: number;

  @Prop({ required: false })
  portableWaterDemand?: string;

  @Prop({ required: false })
  rainWaterHarvesting?: string;

  @Prop({ required: false })
  beyondTheFenceInitiatives?: string;

  @Prop({ required: false, type: Number })
  totalEnergyConsumption?: number;

  @Prop({ required: true, type: Number, default: 0 })
  energyConsumptionDocuments: number;

  @Prop({ required: true, type: Number, default: 0 })
  processManufacturingStatus: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessRenewManufacturingSchema = SchemaFactory.createForClass(
  ProcessRenewManufacturing,
);
ProcessRenewManufacturingSchema.index(
  { urnNo: 1, renewalCycleId: 1 },
  { unique: true, name: 'uniq_process_renew_manufacturing_urn_cycle' },
);
