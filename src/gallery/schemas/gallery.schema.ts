import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const GALLERY_TYPES = [
  'Training & Workshops',
  'Site Visits',
  'Recognition',
] as const;
export type GalleryType = (typeof GALLERY_TYPES)[number];

/** Options for admin add/edit gallery type dropdown (canonical labels only). */
export const GALLERY_TYPE_OPTIONS = GALLERY_TYPES.map((value) => ({
  value,
  label: value,
}));

/** Legacy values kept for existing records; not offered in admin UI. */
export const LEGACY_GALLERY_TYPES = [
  'Summits',
  'Awards',
  'Site Audits',
  'Workshops',
  'Trainings',
  'Other',
] as const;

export const ALL_GALLERY_TYPES = [
  ...GALLERY_TYPES,
  ...LEGACY_GALLERY_TYPES,
] as const;

export const GALLERY_MAX_IMAGES = 10;

export type GalleryDocument = Gallery & Document;

@Schema({ collection: 'galleries', timestamps: false })
export class Gallery {
  /** Unique among non–soft-deleted rows (see partial index below). */
  @Prop({ required: true })
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

  @Prop({ enum: ALL_GALLERY_TYPES, required: true })
  galleryType: GalleryType;

  @Prop()
  description?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Number, default: 1 })
  status: number;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted?: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
GallerySchema.index(
  { galleryId: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } },
);
GallerySchema.index({ deletedAt: 1 });
