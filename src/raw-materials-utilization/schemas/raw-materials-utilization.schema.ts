import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsUtilizationDocument = RawMaterialsUtilization &
  Document;

@Schema({ collection: 'raw_materials_utilization', timestamps: false })
export class RawMaterialsUtilization {
  @Prop({ required: true, unique: true })
  rawMaterialsUtilizationId: number;

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

export const RawMaterialsUtilizationSchema = SchemaFactory.createForClass(
  RawMaterialsUtilization,
);
