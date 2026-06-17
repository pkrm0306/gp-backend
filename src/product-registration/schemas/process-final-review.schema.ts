import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProcessFinalReviewDocument = ProcessFinalReview & Document;

@Schema({ collection: 'process_final_review', timestamps: false })
export class ProcessFinalReview {
  @Prop({ required: true, unique: true })
  processFinalReviewId: number;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  urnNo: string;

  @Prop()
  technicalReview?: string;

  @Prop()
  finalReview?: string;

  @Prop({ type: Number })
  minCredits?: number;

  @Prop({ type: Number })
  maxCredits?: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const ProcessFinalReviewSchema =
  SchemaFactory.createForClass(ProcessFinalReview);

ProcessFinalReviewSchema.index(
  { urnNo: 1, vendorId: 1 },
  { unique: true, name: 'uniq_process_final_review_urn_vendor' },
);
