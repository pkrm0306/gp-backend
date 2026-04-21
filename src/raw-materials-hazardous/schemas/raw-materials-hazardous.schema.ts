import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsHazardousDocument = RawMaterialsHazardous & Document;

@Schema({ collection: 'raw_materials_hazardous', timestamps: false })
export class RawMaterialsHazardous {
  @Prop({ required: true, unique: true })
  rawMaterialsHazardousId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: false })
  details?: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsHazardousSchema =
  SchemaFactory.createForClass(RawMaterialsHazardous);
