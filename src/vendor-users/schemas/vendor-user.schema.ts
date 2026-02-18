import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorUserDocument = VendorUser & Document;

@Schema({ timestamps: true })
export class VendorUser {
  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['vendor', 'partner'] })
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
