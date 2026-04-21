import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsGreenSupplyDocument = RawMaterialsGreenSupply & Document;

@Schema({ collection: 'raw_materials_green_supply', timestamps: false })
export class RawMaterialsGreenSupply {
  @Prop({ required: true, unique: true })
  rawMaterialsGreenSupplyId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: false })
  awarenessAndEducation?: string;

  @Prop({ required: false })
  measuresImplemented?: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsGreenSupplySchema =
  SchemaFactory.createForClass(RawMaterialsGreenSupply);
