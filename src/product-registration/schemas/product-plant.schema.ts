import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductPlantDocument = ProductPlant & Document;

@Schema({ collection: 'product_plants' })
export class ProductPlant {
  @Prop({ required: true, unique: true })
  productPlantId: number;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: true })
  manufacturerId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ required: true })
  eoiNo: string;

  @Prop({ required: true })
  plantName: string;

  @Prop({ required: true })
  plantLocation: string;

  @Prop({ type: Types.ObjectId, ref: 'Country', required: true })
  countryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'State', required: true })
  stateId: Types.ObjectId;

  @Prop({ required: true })
  city: string;

  @Prop({ default: 1 })
  plantStatus: number;

  @Prop({ required: true })
  createdDate: Date;

  /** Soft delete — cascaded when parent product is deleted */
  @Prop({ default: false })
  is_deleted?: boolean;

  @Prop({ type: Date, default: null })
  deleted_at?: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  deleted_by?: Types.ObjectId | null;

  /** Set when this plant was absorbed into another via admin plant merge. */
  @Prop({ type: Types.ObjectId, ref: 'ProductPlant', default: null })
  mergedIntoPlantId?: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  mergedAt?: Date | null;
}

export const ProductPlantSchema = SchemaFactory.createForClass(ProductPlant);

ProductPlantSchema.index({ productId: 1, is_deleted: 1 });
ProductPlantSchema.index({ manufacturerId: 1, is_deleted: 1 });
