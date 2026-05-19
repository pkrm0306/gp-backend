import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UrnSiteVisitDocument = UrnSiteVisit & Document;

@Schema({
  collection: 'urn_site_visits',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class UrnSiteVisit {
  @Prop({ required: true, index: true })
  urnNo: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: '' })
  addressLine1: string;

  @Prop({ default: '' })
  addressLine2: string;

  @Prop({ required: true, default: '' })
  city: string;

  @Prop({ required: true, default: '' })
  state: string;

  @Prop({ required: true, default: '' })
  postalCode: string;

  /** Country name (free text; align with admin country dropdown labels). */
  @Prop({ required: true, default: '' })
  country: string;

  @Prop({ type: String, default: null })
  auditType: string | null;

  @Prop({ type: Date, default: null })
  auditConductedOn: Date | null;

  @Prop({ type: String, default: null })
  conductedBy: string | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  createdBy?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  updatedBy?: Types.ObjectId | null;

  @Prop({ default: false, index: true })
  isDeleted: boolean;
}

export const UrnSiteVisitSchema = SchemaFactory.createForClass(UrnSiteVisit);

UrnSiteVisitSchema.index({ urnNo: 1, createdAt: -1 });
UrnSiteVisitSchema.index({ urnNo: 1, isDeleted: 1 });
UrnSiteVisitSchema.index({ urnNo: 1, name: 1 });
