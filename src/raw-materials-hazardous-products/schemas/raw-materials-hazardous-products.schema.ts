import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsHazardousProductsDocument =
  RawMaterialsHazardousProducts & Document;

@Schema({ collection: 'raw_materials_hazardous_products', timestamps: false })
export class RawMaterialsHazardousProducts {
  @Prop({ required: true, unique: true })
  rawMaterialsHazardousProductsId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: false })
  productsName?: string;

  @Prop({ required: false })
  productsTestReport?: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsHazardousProductsSchema = SchemaFactory.createForClass(
  RawMaterialsHazardousProducts,
);
