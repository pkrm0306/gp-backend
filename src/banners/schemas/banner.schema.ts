import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  /** Relative path stored in DB (for example: banners/file.jpg) */
  @Prop({ required: false, default: '' })
  banner_image?: string;

  @Prop({ required: true })
  imageUrl: string;

  /** Tracks how banner image was provided: uploaded binary (S3) vs manual URL. */
  @Prop({ required: true, enum: ['binary_upload', 'manual_url'], default: 'manual_url' })
  imageSource: 'binary_upload' | 'manual_url';

  @Prop({ required: true })
  heading: string;

  @Prop({ required: true, min: 1 })
  sequenceNumber: number;

  @Prop({ required: true })
  description: string;

  /** 1 = active (toggle on), 0 = inactive (toggle off). */
  @Prop({ default: 1 })
  status: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
