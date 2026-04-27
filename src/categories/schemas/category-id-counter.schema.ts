import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryIdCounterDocument = CategoryIdCounter & Document;

/** Singleton document key — one row holds the next seq after sync */
export const CATEGORY_ID_COUNTER_KEY = 'category';

@Schema({ collection: 'category_id_counter' })
export class CategoryIdCounter {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true, default: 0 })
  seq: number;
}

export const CategoryIdCounterSchema =
  SchemaFactory.createForClass(CategoryIdCounter);
