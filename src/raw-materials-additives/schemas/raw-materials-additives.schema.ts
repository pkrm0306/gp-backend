import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  RM_PARTIAL_NUMBER,
  RM_PARTIAL_TEXT,
} from '../../common/raw-materials/raw-materials-schema.props';

export type RawMaterialsAdditivesDocument = RawMaterialsAdditives & Document;

@Schema({ collection: 'raw_materials_additives', timestamps: false })
export class RawMaterialsAdditives {
  @Prop({ required: true, unique: true })
  rawMaterialsAdditivesId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  unitName: string;

  // @Prop({ required: false })
  @Prop(RM_PARTIAL_NUMBER)
  year?: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year1: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year1a: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year1b: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year1c: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year2: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year2a: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year2b: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year2c: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year3: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year3a: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year3b: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_NUMBER)
  year3c: number;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  psc: string;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  coc: string;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  percentcoc: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsAdditivesSchema = SchemaFactory.createForClass(
  RawMaterialsAdditives,
);
