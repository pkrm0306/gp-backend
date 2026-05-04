import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PdMeasureDocument = PdMeasure & Document;

@Schema({ collection: 'process_pd_measures', timestamps: false })
export class PdMeasure {
  @Prop({ required: true, unique: true })
  productDesignMeasureId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  productDesignId: number;

  @Prop()
  measures?: string;

  @Prop()
  benefits?: string;

  @Prop({ required: true })
  normalizedMeasures: string;

  @Prop({ required: true })
  normalizedBenefits: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const PdMeasureSchema = SchemaFactory.createForClass(PdMeasure);
PdMeasureSchema.index(
  { urnNo: 1, normalizedMeasures: 1, normalizedBenefits: 1 },
  { unique: true, name: 'uniq_pd_measure_per_urn_normalized_pair' },
);
