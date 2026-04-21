import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsRegionalMaterialsDocument =
  RawMaterialsRegionalMaterials & Document;

@Schema({ collection: 'raw_materials_regional_materials', timestamps: false })
export class RawMaterialsRegionalMaterials {
  @Prop({ required: true, unique: true })
  rawMaterialsRegionalMaterialsId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  unitName: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  unit1: number;

  @Prop({ required: true })
  yeardata1: number;

  @Prop({ required: true })
  unit2: number;

  @Prop({ required: true })
  yeardata2: number;

  @Prop({ required: true })
  yeardata3: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsRegionalMaterialsSchema =
  SchemaFactory.createForClass(RawMaterialsRegionalMaterials);
