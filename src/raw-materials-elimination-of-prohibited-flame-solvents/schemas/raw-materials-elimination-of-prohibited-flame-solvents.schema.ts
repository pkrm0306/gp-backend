import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsEliminationOfProhibitedFlameSolventsDocument =
  RawMaterialsEliminationOfProhibitedFlameSolvents & Document;

@Schema({
  collection: 'raw_materials_elimination_of_prohibited_flame_solvents',
  timestamps: false,
})
export class RawMaterialsEliminationOfProhibitedFlameSolvents {
  @Prop({ required: true, unique: true })
  rawMaterialsEliminationOfProhibitedFlameSolventsId: number;

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

export const RawMaterialsEliminationOfProhibitedFlameSolventsSchema =
  SchemaFactory.createForClass(RawMaterialsEliminationOfProhibitedFlameSolvents);
