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

  /**
   * Unique public URL slug (kebab-case). Required for website SEO paths.
   * Backfilled on boot; unique index synced when SYNC_INDEXES_ON_BOOT=true.
   */
  @Prop({ lowercase: true, trim: true })
  slug?: string;

  /** When true, name changes do not regenerate `slug`. */
  @Prop({ default: false })
  slugLocked?: boolean;

  @Prop()
  category_image?: string;

  @Prop()
  meta_title?: string;

  @Prop()
  meta_description?: string;

  /** Same as category_image (synced on write). */
  @Prop()
  meta_image?: string;

  @Prop({ type: [String], default: undefined })
  meta_keywords?: string[];

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

CategorySchema.index(
  { category_name_normalized: 1 },
  { unique: true, sparse: true },
);
CategorySchema.index({ slug: 1 }, { unique: true, sparse: true });
/** Backfill + syncIndexes in CategoriesService.onModuleInit — avoid building unique index before backfill */
CategorySchema.set('autoIndex', false);
