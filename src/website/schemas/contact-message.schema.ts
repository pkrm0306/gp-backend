import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const INQUIRY_TYPES = ['contact', 'product'] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export type ContactMessageDocument = ContactMessage & Document;

@Schema({ timestamps: true })
export class ContactMessage {
  @Prop({ enum: INQUIRY_TYPES, default: 'contact', index: true })
  inquiryType: InquiryType;

  @Prop({ required: false, trim: true, default: '' })
  name: string;

  @Prop({ required: false, lowercase: true, trim: true, index: true, default: '' })
  email: string;

  @Prop({ required: false, trim: true, default: '' })
  phoneNumber: string;

  @Prop({ required: false, trim: true, default: '' })
  subject: string;

  @Prop({ required: false, trim: true, default: '' })
  message: string;

  @Prop({ required: false, trim: true, default: '' })
  designation?: string;

  @Prop({ required: false, trim: true, default: '' })
  organisation?: string;

  @Prop({ required: false, trim: true, default: '' })
  manufacturerId?: string;

  @Prop({ required: false, trim: true, default: '' })
  productId?: string;

  @Prop({ required: false, trim: true, default: '' })
  categoryId?: string;

  @Prop({ required: false, trim: true, default: '' })
  urnNumber?: string;

  /** Admin acknowledged this enquiry (one-way; cannot be unset via API). */
  @Prop({ required: false, default: false, index: true })
  isAcknowledged?: boolean;

  @Prop({ required: false, default: null })
  acknowledgedAt?: Date | null;

  /** Admin user id who acknowledged the enquiry. */
  @Prop({ required: false, trim: true, default: '' })
  acknowledgedBy?: string;

  /**
   * Whether an unacknowledged reminder email has already been sent for this enquiry.
   * Separate from acknowledgement — used so each enquiry is only reminded once.
   */
  @Prop({ required: false, default: false, index: true })
  isReminded?: boolean;

  @Prop({ required: false, default: null })
  remindedAt?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ContactMessageSchema =
  SchemaFactory.createForClass(ContactMessage);
