import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ZohoDealMappingDocument = ZohoDealMapping & Document;

@Schema({ collection: 'zoho_deal_mappings', timestamps: true })
export class ZohoDealMapping {
  @Prop({ required: true, unique: true })
  portalEntityId: string;

  @Prop({ default: 'product-registration' })
  portalEntityType: string;

  @Prop({ type: Types.ObjectId })
  vendorId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  manufacturerId?: Types.ObjectId;

  @Prop()
  zohoLeadId?: string;

  @Prop()
  zohoContactId?: string;

  @Prop()
  zohoAccountId?: string;

  @Prop({ required: true })
  zohoDealId: string;

  @Prop()
  stage?: string;

  @Prop()
  lastSyncedAt?: Date;

  @Prop({ type: Object })
  rawSnapshot?: Record<string, unknown>;
}

export const ZohoDealMappingSchema =
  SchemaFactory.createForClass(ZohoDealMapping);

ZohoDealMappingSchema.index({ portalEntityId: 1 }, { unique: true });
ZohoDealMappingSchema.index({ manufacturerId: 1 });
ZohoDealMappingSchema.index({ vendorId: 1 });
ZohoDealMappingSchema.index({ zohoDealId: 1 }, { unique: true });
