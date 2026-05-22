import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  RM_PARTIAL_NUMBER,
  RM_PARTIAL_TEXT,
} from '../../common/raw-materials/raw-materials-schema.props';

export type RawMaterialsUtilizationManufacturingUnitsDocument =
  RawMaterialsUtilizationManufacturingUnits & Document;

@Schema({
  collection: 'raw_materials_utilization_manufacturing_units',
  timestamps: false,
})
export class RawMaterialsUtilizationManufacturingUnits {
  @Prop({ required: true, unique: true })
  rawMaterialsUtilizationManufacturingUnitsId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  unitName: string;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  yeardata1: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  yeardata2: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  yeardata3: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsUtilizationManufacturingUnitsSchema =
  SchemaFactory.createForClass(RawMaterialsUtilizationManufacturingUnits);
