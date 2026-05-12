import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDesignDocument = ProductDesign & Document;

@Schema({ collection: 'process_product_design', timestamps: false })
export class ProductDesign {
  @Prop({ required: true, unique: true })
  productDesignId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true, type: Number, default: 0 })
  ecoVisionUpload: number; // 0=No File Available, 1=File Available

  @Prop()
  statergies?: string;

  @Prop({ required: true, type: Number, default: 0 })
  productDesignSupportingDocument: number; // 0=No File Available, 1=File Available

  @Prop({ required: true, type: Number, default: 0 })
  productDesignStatus: number; // 0=Pending, 1=Completed

  @Prop({
    type: [
      {
        measuresImplemented: { type: String },
        benefitsAchieved: { type: String },
      },
    ],
    default: [],
    required: false,
  })
  measuresAndBenefits?: Array<{
    measuresImplemented: string;
    benefitsAchieved: string;
  }>;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProductDesignSchema = SchemaFactory.createForClass(ProductDesign);
