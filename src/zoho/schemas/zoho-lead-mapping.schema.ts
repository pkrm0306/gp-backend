import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ZohoLeadMappingDocument = ZohoLeadMapping & Document;

@Schema({ collection: 'zoho_lead_mappings', timestamps: true })
export class ZohoLeadMapping {
  @Prop({ required: true, unique: true })
  portalUserId: string;

  @Prop({ type: Types.ObjectId })
  vendorId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  manufacturerId?: Types.ObjectId;

  @Prop({ required: true })
  zohoLeadId: string;

  @Prop()
  email?: string;

  @Prop()
  company?: string;

  @Prop({ default: 'vendor-registration' })
  source: string;

  @Prop()
  lastSyncedAt?: Date;

  @Prop({ type: Object })
  rawSnapshot?: Record<string, unknown>;
}

export const ZohoLeadMappingSchema =
  SchemaFactory.createForClass(ZohoLeadMapping);

ZohoLeadMappingSchema.index({ portalUserId: 1 }, { unique: true });
ZohoLeadMappingSchema.index(
  { manufacturerId: 1 },
  { unique: true, sparse: true },
);
ZohoLeadMappingSchema.index({ vendorId: 1 });
ZohoLeadMappingSchema.index({ zohoLeadId: 1 }, { unique: true });
