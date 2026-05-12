import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessManufacturingDocument = ProcessManufacturing & Document;

@Schema({ collection: 'process_manufacturing', timestamps: false })
export class ProcessManufacturing {
  @Prop({ required: true, unique: true })
  processManufacturingId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: true, type: Number, default: 0 })
  energyConservationSupportingDocuments: number; // 0=No File Available, 1=File Available

  @Prop({ required: false })
  portableWaterDemand?: string;

  @Prop({ required: false })
  rainWaterHarvesting?: string;

  @Prop({ required: false })
  beyondTheFenceInitiatives?: string;

  @Prop({ required: false, type: Number })
  totalEnergyConsumption?: number;

  @Prop({ required: true, type: Number, default: 0 })
  energyConsumptionDocuments: number; // 0=No File Available, 1=File Available

  @Prop({ required: true, type: Number, default: 0 })
  processManufacturingStatus: number; // 0=Pending, 1=Completed

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessManufacturingSchema =
  SchemaFactory.createForClass(ProcessManufacturing);
