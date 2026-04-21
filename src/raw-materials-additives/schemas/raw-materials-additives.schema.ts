import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsAdditivesDocument = RawMaterialsAdditives & Document;

@Schema({ collection: 'raw_materials_additives', timestamps: false })
export class RawMaterialsAdditives {
  @Prop({ required: true, unique: true })
  rawMaterialsAdditivesId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  unitName: string;

  @Prop({ required: true })
  year1: number;

  @Prop({ required: true })
  year1a: number;

  @Prop({ required: true })
  year1b: number;

  @Prop({ required: true })
  year1c: number;

  @Prop({ required: true })
  year2: number;

  @Prop({ required: true })
  year2a: number;

  @Prop({ required: true })
  year2b: number;

  @Prop({ required: true })
  year2c: number;

  @Prop({ required: true })
  year3: number;

  @Prop({ required: true })
  year3a: number;

  @Prop({ required: true })
  year3b: number;

  @Prop({ required: true })
  year3c: number;

  @Prop({ required: true })
  psc: string;

  @Prop({ required: true })
  coc: string;

  @Prop({ required: true })
  percentcoc: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsAdditivesSchema =
  SchemaFactory.createForClass(RawMaterialsAdditives);
