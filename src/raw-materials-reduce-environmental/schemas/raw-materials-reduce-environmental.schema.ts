import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RM_PARTIAL_TEXT } from '../../common/raw-materials/raw-materials-schema.props';

export type RawMaterialsReduceEnvironmentalDocument =
  RawMaterialsReduceEnvironmental & Document;

@Schema({ collection: 'raw_materials_reduce_environmental', timestamps: false })
export class RawMaterialsReduceEnvironmental {
  @Prop({ required: true, unique: true })
  rawMaterialsReduceEnvironmentalId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  location: string;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  enhancementOfMinesLife: string;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  topsoilConservation: string;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  waterTableManagement: string;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  restorationOfSpentMines: string;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  greenBeltDevelopmentAndBioDiversity: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsReduceEnvironmentalSchema =
  SchemaFactory.createForClass(RawMaterialsReduceEnvironmental);
