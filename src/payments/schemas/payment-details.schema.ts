import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDetailsDocument = PaymentDetails & Document;

@Schema({ collection: 'payment_details', timestamps: false })
export class PaymentDetails {
  @Prop({ required: true, unique: true })
  paymentId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  quoteAmount: number;

  @Prop({ required: true, type: Number })
  quoteGstAmount: number;

  @Prop({ required: true, type: Number })
  quoteTdsAmount: number;

  @Prop({ required: true, type: Number })
  quoteTotal: number;

  @Prop()
  proposalFile?: string;

  @Prop()
  adminGstNo?: string;

  @Prop()
  vendorGstNo?: string;

  @Prop({
    required: true,
    enum: ['registration', 'certification', 'renew'],
    default: 'registration',
  })
  paymentType: string;

  /** Required for `paymentType: renew` — scopes fee to one renewal cycle. */
  @Prop({ type: Types.ObjectId, ref: 'RenewalCycle' })
  renewalCycleId?: Types.ObjectId;

  @Prop({
    enum: ['online', 'cheque_or_dd', 'neft_or_rtgs'],
  })
  paymentMode?: string;

  @Prop({ required: true, type: Number, default: 0 })
  onlinePaymentId: number;

  @Prop()
  paymentReferenceNo?: string;

  @Prop()
  paymentChequeDate?: Date;

  @Prop()
  chequeOrDdFile?: string;

  @Prop()
  tdsFile?: string;

  @Prop()
  productsToBeCertified?: string;

  @Prop({ required: true, type: Number, default: 0 })
  paymentStatus: number; // 0=Created, 1=Pending, 2=Completed, 3=Cancelled

  /** 0=pending vendor review, 1=approved, 2=rejected (await admin re-upload) */
  @Prop({ required: true, type: Number, default: 0 })
  vendorProposalApprovalStatus: number;

  @Prop()
  proposalRejectionRemarks?: string;

  /** Admin remarks when rejecting vendor payment proof (paymentStatus = 3) */
  @Prop()
  paymentRejectionRemarks?: string;

  /** Previous proposal file path after admin re-upload (audit) */
  @Prop()
  previousProposalFile?: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const PaymentDetailsSchema =
  SchemaFactory.createForClass(PaymentDetails);

PaymentDetailsSchema.index(
  { urnNo: 1, paymentType: 1, renewalCycleId: 1 },
  {
    unique: true,
    sparse: true,
    name: 'uniq_renew_payment_per_cycle',
  },
);

/** Admin dashboard payment status / recent payments / revenue facets */
PaymentDetailsSchema.index({ paymentStatus: 1, updatedDate: -1 });
PaymentDetailsSchema.index({ paymentStatus: 1, createdDate: -1 });
PaymentDetailsSchema.index({ vendorId: 1, paymentStatus: 1, updatedDate: -1 });
PaymentDetailsSchema.index({ vendorId: 1, paymentStatus: 1, createdDate: -1 });
