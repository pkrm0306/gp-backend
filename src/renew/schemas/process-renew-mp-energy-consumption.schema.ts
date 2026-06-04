import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessRenewMpEnergyConsumptionDocument =
  ProcessRenewMpEnergyConsumption & Document;

@Schema({
  collection: 'process_renew_mp_energy_consumption',
  timestamps: false,
})
export class ProcessRenewMpEnergyConsumption {
  @Prop({ required: true, unique: true })
  processRenewMpEnergyConsumptionId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true, index: true })
  urnNo: string;

  @Prop({ required: true, type: Number })
  processRenewManufacturingId: number;

  @Prop({ required: false })
  energyConservationProject?: string;

  @Prop({ required: false, type: Number })
  annualEnergySavings?: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessRenewMpEnergyConsumptionSchema =
  SchemaFactory.createForClass(ProcessRenewMpEnergyConsumption);
