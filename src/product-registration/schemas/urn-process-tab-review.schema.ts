import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UrnProcessTabReviewDocument = UrnProcessTabReview & Document;

@Schema({ collection: 'urn_process_tab_reviews', timestamps: true })
export class UrnProcessTabReview {
  @Prop({ required: true, trim: true, index: true })
  urnNo: string;

  @Prop({ required: true, trim: true })
  tabKey: string;

  /** `0` = process tab aggregate; `1–15` = raw materials step */
  @Prop({ required: true, default: 0 })
  stepId: number;

  /** `0` pending, `1` approved, `2` rejected */
  @Prop({ required: true, default: 0 })
  reviewStatus: number;

  @Prop({ type: Types.ObjectId, default: null })
  reviewedBy?: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  reviewedAt?: Date | null;

  @Prop({ trim: true, default: null })
  rejectionRemarks?: string | null;
}

export const UrnProcessTabReviewSchema =
  SchemaFactory.createForClass(UrnProcessTabReview);

UrnProcessTabReviewSchema.index(
  { urnNo: 1, tabKey: 1, stepId: 1 },
  { unique: true },
);
UrnProcessTabReviewSchema.index({ urnNo: 1, reviewStatus: 1 });
