import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ collection: 'categories' })
export class Category {
  @Prop({ required: true, unique: true })
  category_id: number;

  @Prop({ required: true })
  category_name: string;

  /** Lowercase trimmed/collapsed name for case-insensitive global uniqueness */
  @Prop()
  category_name_normalized?: string;

  @Prop()
  category_image?: string;

  /** Comma-separated raw material form ids, e.g. "1,3,2" */
  @Prop()
  category_raw_material_forms?: string;

  @Prop({ default: 1 })
  category_status: number;

  /** Sector id */
  @Prop({ default: 1 })
  sector: number;

  @Prop()
  created_date?: string;

  @Prop()
  updated_date?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ category_name_normalized: 1 }, { unique: true, sparse: true });
/** Backfill + syncIndexes in CategoriesService.onModuleInit — avoid building unique index before backfill */
CategorySchema.set('autoIndex', false);
