import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsEliminationOfProhibitedFlameDocument =
  RawMaterialsEliminationOfProhibitedFlame & Document;

@Schema({
  collection: 'raw_materials_elimination_of_prohibited_flame',
  timestamps: false,
})
export class RawMaterialsEliminationOfProhibitedFlame {
  @Prop({ required: true, unique: true })
  rawMaterialsEliminationOfProhibitedFlameId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: false })
  measuresImplemented?: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsEliminationOfProhibitedFlameSchema =
  SchemaFactory.createForClass(RawMaterialsEliminationOfProhibitedFlame);
