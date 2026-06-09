import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const GALLERY_TYPES = [
  'Summits',
  'Awards',
  'Site Audits',
  'Workshops',
  'Trainings',
  'Other',
] as const;
export type GalleryType = (typeof GALLERY_TYPES)[number];

export type GalleryDocument = Gallery & Document;

@Schema({ collection: 'galleries', timestamps: false })
export class Gallery {
  @Prop({ required: true, unique: true })
  galleryId: number;

  @Prop({ required: true })
  title: string;

  /** Local upload path (e.g. /uploads/gallery/xxx.png) or absolute URL */
  @Prop()
  image?: string;

  /** Relative path stored in DB (for example: gallery/file.png) */
  @Prop()
  gallery_image?: string;

  @Prop({ type: [String], default: [] })
  galleryImages?: string[];

  @Prop({ enum: GALLERY_TYPES, required: true })
  galleryType: GalleryType;

  @Prop()
  description?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Number, default: 1 })
  status: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
