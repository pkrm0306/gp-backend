import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  RM_PARTIAL_NUMBER,
  RM_PARTIAL_TEXT,
} from '../../common/raw-materials/raw-materials-schema.props';

export type RawMaterialsOptimizationOfRawMixDocument =
  RawMaterialsOptimizationOfRawMix & Document;

@Schema({
  collection: 'raw_materials_optimization_of_raw_mix',
  timestamps: false,
})
export class RawMaterialsOptimizationOfRawMix {
  @Prop({ required: true, unique: true })
  rawMaterialsOptimizationOfRawMixId: number;

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

export const RawMaterialsOptimizationOfRawMixSchema =
  SchemaFactory.createForClass(RawMaterialsOptimizationOfRawMix);
