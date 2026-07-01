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

  /** Tracks how banner image was provided: uploaded file vs URL/path in form. */
  @Prop({
    type: String,
    enum: ['binary_upload', 'manual_url'],
    default: 'manual_url',
  })
  imageSource?: 'binary_upload' | 'manual_url';

  /** Relative path for uploaded banner video (e.g. banners/banner-video-….mp4). */
  @Prop({ required: false, default: '' })
  banner_video?: string;

  @Prop({ required: false, default: '' })
  videoUrl?: string;

  /** Banner video is always provided via multipart upload (no manual URL). */
  @Prop({
    type: String,
    enum: ['binary_upload'],
    required: false,
  })
  videoSource?: 'binary_upload';

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
