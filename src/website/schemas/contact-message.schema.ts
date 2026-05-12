import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactMessageDocument = ContactMessage & Document;

@Schema({ timestamps: true })
export class ContactMessage {
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

  createdAt?: Date;
  updatedAt?: Date;
}

export const ContactMessageSchema =
  SchemaFactory.createForClass(ContactMessage);
