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

  createdAt?: Date;
  updatedAt?: Date;
}

export const ContactMessageSchema =
  SchemaFactory.createForClass(ContactMessage);
