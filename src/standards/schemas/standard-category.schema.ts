import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StandardCategoryDocument = StandardCategory & Document;

/** Many-to-many: numeric `standard.id` ↔ numeric `category_id` (GET /categories). */
@Schema({ collection: 'standard_categories', timestamps: true })
export class StandardCategory {
  @Prop({ required: true })
  standard_id: number;

  @Prop({ required: true })
  category_id: number;
}

export const StandardCategorySchema =
  SchemaFactory.createForClass(StandardCategory);
StandardCategorySchema.index(
  { standard_id: 1, category_id: 1 },
  { unique: true },
);
StandardCategorySchema.index({ category_id: 1 });
StandardCategorySchema.index({ standard_id: 1 });
