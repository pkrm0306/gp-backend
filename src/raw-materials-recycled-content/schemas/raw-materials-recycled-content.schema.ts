import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsRecycledContentDocument =
  RawMaterialsRecycledContent & Document;

@Schema({ collection: 'raw_materials_recycled_content', timestamps: false })
export class RawMaterialsRecycledContent {
  @Prop({ required: true, unique: true })
  rawMaterialsRecycledContentId: number;

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

export const RawMaterialsRecycledContentSchema =
  SchemaFactory.createForClass(RawMaterialsRecycledContent);
