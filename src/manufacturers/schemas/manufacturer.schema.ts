import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  VendorContactSlot,
  VendorContactSlotSchema,
} from './vendor-contact-slot.schema';

export type ManufacturerDocument = Manufacturer & Document;

@Schema({ timestamps: true })
export class Manufacturer {
  @Prop({ required: true })
  manufacturerName: string;

  @Prop({ required: false, unique: true, sparse: true, default: undefined })
  gpInternalId?: string;

  @Prop({ required: false, default: undefined })
  manufacturerInitial?: string;

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

  /** PAN card id (10 chars, e.g. ABCDE1234F). Separate from document URL in vendorPanDocument. */
  @Prop()
  vendorPan?: string;

  /** GST certificate / document (PDF), stored as public URL path under /uploads/... */
  @Prop()
  vendorGstPdf?: string;

  @Prop({ default: 0 })
  vendor_status: number;

  /** Headcount / scale band collected at vendor self-registration (e.g. "1-10", "11-50"). */
  @Prop()
  companySize?: string;

  @Prop()
  manufacturerImage?: string;

  /** Company logo image URL path (e.g. /uploads/manufacturers/...). */
  @Prop()
  companyLogo?: string;

  /** PAN card document scan, public URL path (separate from PAN id in vendorPan). */
  @Prop()
  vendorPanDocument?: string;

  @Prop({ type: VendorContactSlotSchema })
  technicalContact?: VendorContactSlot;

  @Prop({ type: VendorContactSlotSchema })
  marketingContact?: VendorContactSlot;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ManufacturerSchema = SchemaFactory.createForClass(Manufacturer);
