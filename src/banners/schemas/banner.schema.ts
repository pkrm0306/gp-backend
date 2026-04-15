import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: false, default: '' })
  targetUrl?: string;

  @Prop({ required: true })
  heading: string;

  @Prop({ required: true })
  description: string;

  /** 1 = active (toggle on), 0 = inactive (toggle off). */
  @Prop({ default: 1 })
  status: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
