import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessRenewWmManufacturingUnitDocument =
  ProcessRenewWmManufacturingUnit & Document;

@Schema({
  collection: 'process_renew_wm_manufacturing_units',
  timestamps: false,
})
export class ProcessRenewWmManufacturingUnit {
  @Prop({ required: true, unique: true })
  processRenewWmManufacturingUnitId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true, index: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'RenewalCycle', index: true })
  renewalCycleId?: Types.ObjectId;

  @Prop({ required: false, type: Number })
  processRenewWasteManagementId?: number;

  @Prop({ required: false })
  unitName?: string;

  @Prop({ required: false })
  hazardousWasteYear1?: string;

  @Prop({ required: false })
  hazardousWasteYear2?: string;

  @Prop({ required: false })
  hazardousWasteYear3?: string;

  @Prop({ required: false })
  hazardousWasteProductionUnit?: string;

  @Prop({ required: false })
  hazardousWasteQuantityUnit?: string;

  @Prop({ required: false, type: Number })
  hazardousWasteProductionYear1?: number;

  @Prop({ required: false, type: Number })
  hazardousWasteProductionYear2?: number;

  @Prop({ required: false, type: Number })
  hazardousWasteProductionYear3?: number;

  @Prop({ required: false, type: Number })
  hazardousWasteQuantityYear1?: number;

  @Prop({ required: false, type: Number })
  hazardousWasteQuantityYear2?: number;

  @Prop({ required: false, type: Number })
  hazardousWasteQuantityYear3?: number;

  @Prop({ required: false })
  nonHazardousWasteYear1?: string;

  @Prop({ required: false })
  nonHazardousWasteYear2?: string;

  @Prop({ required: false })
  nonHazardousWasteYear3?: string;

  @Prop({ required: false })
  nonHazardousWasteProductionUnit?: string;

  @Prop({ required: false })
  nonHazardousWasteWaterUnit?: string;

  @Prop({ required: false, type: Number })
  nonHazardousWasteProductionYear1?: number;

  @Prop({ required: false, type: Number })
  nonHazardousWasteProductionYear2?: number;

  @Prop({ required: false, type: Number })
  nonHazardousWasteProductionYear3?: number;

  @Prop({ required: false, type: Number })
  nonHazardousWasteWaterYear1?: number;

  @Prop({ required: false, type: Number })
  nonHazardousWasteWaterYear2?: number;

  @Prop({ required: false, type: Number })
  nonHazardousWasteWaterYear3?: number;

  @Prop({ required: false, type: Number })
  calculateBulkRshwd?: number;

  @Prop({ required: false, type: Number })
  calculateBulkRsnhwd?: number;

  @Prop({ required: false })
  calculateBulkRshwdMultipled?: string;

  @Prop({ required: false })
  calculateBulkRsnhwdMultipled?: string;

  @Prop({ required: false })
  wmImplementationDetailsWmUnits?: string;

  @Prop({ required: false })
  createdDate?: Date;

  @Prop({ required: false })
  updatedDate?: Date;
}

export const ProcessRenewWmManufacturingUnitSchema =
  SchemaFactory.createForClass(ProcessRenewWmManufacturingUnit);
ProcessRenewWmManufacturingUnitSchema.index(
  { urnNo: 1, renewalCycleId: 1 },
  { name: 'idx_renew_wm_units_urn_cycle' },
);
