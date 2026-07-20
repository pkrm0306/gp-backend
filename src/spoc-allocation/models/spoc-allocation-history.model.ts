import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SpocAllocationHistoryDocument = SpocAllocationHistory & Document;

/**
 * Append-only history of SPOC allocation changes.
 * Isolated from Product schema.
 */
@Schema({
  collection: 'spoc_allocation_history',
  timestamps: { createdAt: 'createdAt', updatedAt: false },
})
export class SpocAllocationHistory {
  @Prop({
    type: Types.ObjectId,
    ref: 'SpocAllocation',
    required: true,
    index: true,
  })
  allocationId: Types.ObjectId;

  /** Null on first assignment. */
  @Prop({ type: Types.ObjectId, ref: 'VendorUser', default: null })
  previousSpoc: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'VendorUser', required: true })
  newSpoc: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'VendorUser', required: true })
  changedBy: Types.ObjectId;

  @Prop({ trim: true, default: '' })
  remarks: string;

  /**
   * Set when the post-success allocation email was claimed/sent.
   * Prevents duplicate emails for the same history event.
   */
  @Prop({ type: Date, default: null })
  emailNotifiedAt?: Date | null;

  @Prop({ type: Date })
  createdAt?: Date;
}

export const SpocAllocationHistorySchema =
  SchemaFactory.createForClass(SpocAllocationHistory);

SpocAllocationHistorySchema.index(
  { allocationId: 1, createdAt: -1 },
  { name: 'spoc_allocation_history_allocationId_createdAt' },
);

SpocAllocationHistorySchema.index(
  { newSpoc: 1, createdAt: -1 },
  { name: 'spoc_allocation_history_newSpoc_createdAt' },
);

SpocAllocationHistorySchema.index(
  { previousSpoc: 1, createdAt: -1 },
  { name: 'spoc_allocation_history_previousSpoc_createdAt' },
);

SpocAllocationHistorySchema.index(
  { changedBy: 1, createdAt: -1 },
  { name: 'spoc_allocation_history_changedBy_createdAt' },
);
