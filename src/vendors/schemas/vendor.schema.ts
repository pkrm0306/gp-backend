import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorDocument = Vendor & Document;

@Schema({ timestamps: true })
export class Vendor {
  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true })
  vendorName: string;

  @Prop({ required: true })
  vendorEmail: string;

  @Prop({ required: true })
  vendorPhone: string;

  @Prop()
  vendorDesignation?: string;

  @Prop()
  vendorGst?: string;

  @Prop({ default: 0 })
  vendorStatus: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
