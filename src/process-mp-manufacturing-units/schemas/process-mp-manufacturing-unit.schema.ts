import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessMpManufacturingUnitDocument = ProcessMpManufacturingUnit &
  Document;

@Schema({ collection: 'process_mp_manufacturing_units', timestamps: false })
export class ProcessMpManufacturingUnit {
  @Prop({ required: true, unique: true })
  processMpManufacturingUnitId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: false })
  unitName?: string;

  @Prop({ required: false, enum: ['yes', 'no'] })
  renewableEnergyUtilization?: 'yes' | 'no';

  @Prop({ required: false })
  ecdYear1?: string;

  @Prop({ required: false })
  ecdYear2?: string;

  @Prop({ required: false })
  ecdYear3?: string;

  @Prop({ required: false })
  ecdProductionUnit?: string;

  @Prop({ required: false, type: Number })
  ecdProductionYear1?: number;

  @Prop({ required: false, type: Number })
  ecdProductionYear2?: number;

  @Prop({ required: false, type: Number })
  ecdProductionYear3?: number;

  @Prop({ required: false })
  ecdElectricUnit?: string;

  @Prop({ required: false, type: Number })
  ecdElectricYear1?: number;

  @Prop({ required: false, type: Number })
  ecdElectricYear2?: number;

  @Prop({ required: false, type: Number })
  ecdElectricYear3?: number;

  @Prop({ required: false })
  ecdThermalUnitFuel1?: string;

  @Prop({ required: false })
  ecdThermalUnitFuel2?: string;

  @Prop({ required: false })
  ecdThermalUnitFuel3?: string;

  @Prop({ required: false, type: Number })
  ecdThermalFuel1Year1?: number;

  @Prop({ required: false, type: Number })
  ecdThermalFuel1Year2?: number;

  @Prop({ required: false, type: Number })
  ecdThermalFuel1Year3?: number;

  @Prop({ required: false, type: Number })
  ecdThermalFuel2Year1?: number;

  @Prop({ required: false, type: Number })
  ecdThermalFuel2Year2?: number;

  @Prop({ required: false, type: Number })
  ecdThermalFuel2Year3?: number;

  @Prop({ required: false, type: Number })
  ecdThermalFuel3Year1?: number;

  @Prop({ required: false, type: Number })
  ecdThermalFuel3Year2?: number;

  @Prop({ required: false, type: Number })
  ecdThermalFuel3Year3?: number;

  @Prop({ required: false, type: Number })
  ecdCalorificFuel1Year1?: number;

  @Prop({ required: false, type: Number })
  ecdCalorificFuel1Year2?: number;

  @Prop({ required: false, type: Number })
  ecdCalorificFuel1Year3?: number;

  @Prop({ required: false, type: Number })
  ecdCalorificFuel2Year1?: number;

  @Prop({ required: false, type: Number })
  ecdCalorificFuel2Year2?: number;

  @Prop({ required: false, type: Number })
  ecdCalorificFuel2Year3?: number;

  @Prop({ required: false, type: Number })
  ecdCalorificFuel3Year1?: number;

  @Prop({ required: false, type: Number })
  ecdCalorificFuel3Year2?: number;

  @Prop({ required: false, type: Number })
  ecdCalorificFuel3Year3?: number;

  @Prop({ required: false })
  ecdTextareaNewUnits?: string;

  @Prop({ required: false })
  wcdYear1?: string;

  @Prop({ required: false })
  wcdYear2?: string;

  @Prop({ required: false })
  wcdYear3?: string;

  @Prop({ required: false })
  wcdProductionUnit?: string;

  @Prop({ required: false })
  wcdWaterUnit?: string;

  @Prop({ required: false, type: Number })
  wcdProductionYear1?: number;

  @Prop({ required: false, type: Number })
  wcdProductionYear2?: number;

  @Prop({ required: false, type: Number })
  wcdProductionYear3?: number;

  @Prop({ required: false, type: Number })
  wcdWaterYear1?: number;

  @Prop({ required: false, type: Number })
  wcdWaterYear2?: number;

  @Prop({ required: false, type: Number })
  wcdWaterYear3?: number;

  @Prop({ required: false })
  reYear?: string;

  @Prop({ required: false, type: Number })
  reSolarPhotovoltaic?: number;

  @Prop({ required: false, type: Number })
  reWind?: number;

  @Prop({ required: false, type: Number })
  reBiomass?: number;

  @Prop({ required: false, type: Number })
  reSolarThermal?: number;

  @Prop({ required: false })
  reOthersUnit?: string;

  @Prop({ required: false, type: Number })
  reOthers?: number;

  @Prop({ required: true, type: Number, default: 0 })
  offsiteRenewablePower: number;

  @Prop({ required: false, type: Number, default: 0 })
  processMpManufacturingUnitStatus?: number; // 0=Pending, 1=Completed

  @Prop({ required: false, type: Number })
  calculateBulkSec?: number;

  @Prop({ required: false, type: Number })
  calculateBulkSwc?: number;

  @Prop({ required: false })
  calculateBulkSecMultipled?: string;

  @Prop({ required: false })
  calculateBulkSwcMultipled?: string;

  @Prop({ required: false })
  measuresImplementedMpUnits?: string;

  @Prop({ required: false })
  detailsOfRainWaterHarvestingMpUnits?: string;

  @Prop({ required: false })
  createdDate?: Date;

  @Prop({ required: false })
  updatedDate?: Date;
}

export const ProcessMpManufacturingUnitSchema = SchemaFactory.createForClass(
  ProcessMpManufacturingUnit,
);
