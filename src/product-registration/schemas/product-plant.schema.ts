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
}

export const ProductPlantSchema = SchemaFactory.createForClass(ProductPlant);
