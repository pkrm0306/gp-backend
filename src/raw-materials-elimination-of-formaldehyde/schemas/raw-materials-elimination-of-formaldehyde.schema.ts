import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsEliminationOfFormaldehydeDocument =
  RawMaterialsEliminationOfFormaldehyde & Document;

@Schema({
  collection: 'raw_materials_elimination_of_formaldehyde',
  timestamps: false,
})
export class RawMaterialsEliminationOfFormaldehyde {
  @Prop({ required: true, unique: true })
  rawMaterialsEliminationOfFormaldehydeId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  productsName: string;

  @Prop({ required: true })
  productsTestReport: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsEliminationOfFormaldehydeSchema = SchemaFactory.createForClass(
  RawMaterialsEliminationOfFormaldehyde,
);
