import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  enhancementOfMinesLife: string;

  @Prop({ required: true })
  topsoilConservation: string;

  @Prop({ required: true })
  waterTableManagement: string;

  @Prop({ required: true })
  restorationOfSpentMines: string;

  @Prop({ required: true })
  greenBeltDevelopmentAndBioDiversity: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsReduceEnvironmentalSchema = SchemaFactory.createForClass(
  RawMaterialsReduceEnvironmental,
);
