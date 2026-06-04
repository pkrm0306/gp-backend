import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UrnRenewTabReviewDocument = UrnRenewTabReview & Document;

@Schema({ collection: 'urn_renew_tab_reviews', timestamps: true })
export class UrnRenewTabReview {
  @Prop({ required: true, trim: true, index: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  renewalCycleId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  tabKey: string;

  /** Always `0` for renewal process tabs (no raw-material steps). */
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

export const UrnRenewTabReviewSchema =
  SchemaFactory.createForClass(UrnRenewTabReview);

UrnRenewTabReviewSchema.index(
  { urnNo: 1, renewalCycleId: 1, tabKey: 1, stepId: 1 },
  { unique: true },
);
UrnRenewTabReviewSchema.index({
  urnNo: 1,
  renewalCycleId: 1,
  reviewStatus: 1,
});
