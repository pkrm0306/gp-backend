import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  ACCOUNT_DELETION_ID_COUNTER_KEY,
  AccountDeletionIdCounter,
} from './account-deletion-id-counter.schema';

export type AccountDeletionRequestDocument = AccountDeletionRequest & Document;

export enum AccountDeletionStatus {
  Requested = 'Requested',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Completed = 'Completed',
}

export const ACCOUNT_DELETION_REASONS = [
  'No longer using the platform',
  'Privacy concerns',
  'Duplicate account',
  'Business closed or transferred',
  'Other',
] as const;

@Schema({ collection: 'account_deletion_requests', timestamps: true })
export class AccountDeletionRequest {
  /** Auto-generated as ADR-000001, ADR-000002, … */
  @Prop({ type: String, unique: true, index: true })
  requestNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true, index: true })
  vendorId: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  reason: string;

  @Prop({ type: String, required: false, default: '' })
  description?: string;

  /** Vendor confirmed understanding that this is a deletion request workflow. */
  @Prop({ type: Boolean, required: true, default: false })
  confirmed: boolean;

  @Prop({
    type: String,
    enum: Object.values(AccountDeletionStatus),
    default: AccountDeletionStatus.Requested,
    index: true,
  })
  status: AccountDeletionStatus;

  @Prop({ type: String, required: false, default: '' })
  adminRemarks?: string;

  @Prop({ type: Types.ObjectId, required: false, default: null })
  reviewedBy?: Types.ObjectId | null;

  @Prop({ type: Date, required: false, default: null })
  reviewedAt?: Date | null;
}

export const AccountDeletionRequestSchema = SchemaFactory.createForClass(
  AccountDeletionRequest,
);

AccountDeletionRequestSchema.index({ vendorId: 1, status: 1 });
AccountDeletionRequestSchema.index({ vendorId: 1, createdAt: -1 });

/**
 * Assigns requestNo (ADR-000001 …) on first save via an atomic counter.
 */
AccountDeletionRequestSchema.pre('save', async function (next) {
  if (!this.isNew || this.requestNo) {
    return next();
  }

  try {
    const CounterModel = this.db.model(AccountDeletionIdCounter.name);
    const counter = await CounterModel.findOneAndUpdate(
      { _id: ACCOUNT_DELETION_ID_COUNTER_KEY },
      { $inc: { seq: 1 } },
      { upsert: true, new: true },
    );

    this.requestNo = `ADR-${String(counter.seq).padStart(6, '0')}`;
    next();
  } catch (err) {
    next(err as Error);
  }
});
