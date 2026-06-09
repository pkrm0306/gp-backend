import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryIdCounterDocument = GalleryIdCounter & Document;

export const GALLERY_ID_COUNTER_KEY = 'gallery';

@Schema({ collection: 'gallery_id_counter' })
export class GalleryIdCounter {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true, default: 0 })
  seq: number;
}

export const GalleryIdCounterSchema =
  SchemaFactory.createForClass(GalleryIdCounter);
