import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorUserDocument = VendorUser & Document;

@Schema({ timestamps: true })
export class VendorUser {
  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  // Legacy alias retained for backward compatibility with existing modules.
  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: false })
  vendorId?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  designation?: string;

  @Prop()
  image?: string;

  @Prop()
  facebookUrl?: string;

  @Prop()
  twitterUrl?: string;

  @Prop()
  linkedinUrl?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['vendor', 'partner', 'admin', 'super_admin'] })
  type: string;

  @Prop({ default: 1 })
  status: number;

  @Prop()
  otp?: string;

  @Prop({ default: false })
  isVerified: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const VendorUserSchema = SchemaFactory.createForClass(VendorUser);

// Uniqueness should be per vendor/manufacturer (not global).
VendorUserSchema.index({ manufacturerId: 1, email: 1 }, { unique: true });
VendorUserSchema.index({ manufacturerId: 1, phone: 1 }, { unique: true });
