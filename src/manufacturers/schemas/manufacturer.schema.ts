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

  /**
   * After self-registration, false until the vendor completes email OTP.
   * Admin **unverified** listings exclude `false` so pending-OTP rows stay hidden.
   * Omitted on legacy rows (treated as eligible for the unverified list).
   */
  @Prop()
  vendorPortalEmailVerified?: boolean;

  @Prop({ required: true })
  vendor_name: string;

  @Prop({ required: true, unique: true })
  vendor_email: string;

  @Prop({ required: true })
  vendor_phone: string;

  @Prop()
  vendor_website?: string;

  @Prop()
  vendor_facebook?: string;

  @Prop()
  vendor_youtube?: string;

  @Prop()
  vendor_twitter?: string;

  @Prop()
  vendor_linkedin?: string;

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

  /**
   * Soft account deletion (DPDP). When set, portal access is blocked, products are hidden
   * from the public website, and login email/phone are released for re-registration.
   */
  @Prop()
  accountDeletedAt?: Date;

  /** Original login email preserved after soft deletion freed `vendor_email`. */
  @Prop()
  deletedVendorEmail?: string;

  /** Original login phone preserved after soft deletion freed `vendor_phone`. */
  @Prop()
  deletedVendorPhone?: string;

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

/** Admin dashboard vendor activity / pending approval aggregations */
ManufacturerSchema.index({ manufacturerStatus: 1, vendor_status: 1, createdAt: -1 });
ManufacturerSchema.index({ createdAt: -1 });
