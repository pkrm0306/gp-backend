import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ManufacturerDocument = Manufacturer & Document;

@Schema({ timestamps: true })
export class Manufacturer {
  @Prop({ required: true })
  manufacturerName: string;

  @Prop({ required: false, unique: true, sparse: true, default: null })
  gpInternalId?: string | null;

  @Prop({ required: false, default: null })
  manufacturerInitial?: string | null;

  @Prop({ default: 0 })
  manufacturerStatus: number;

  @Prop({ required: true })
  vendor_name: string;

  @Prop({ required: true, unique: true })
  vendor_email: string;

  @Prop({ required: true })
  vendor_phone: string;

  @Prop()
  vendor_website?: string;

  @Prop()
  vendor_designation?: string;

  @Prop()
  vendor_gst?: string;

  @Prop({ default: 0 })
  vendor_status: number;

  @Prop()
  manufacturerImage?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ManufacturerSchema = SchemaFactory.createForClass(Manufacturer);
