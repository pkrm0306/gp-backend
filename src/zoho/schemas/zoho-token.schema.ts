import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ZohoTokenDocument = ZohoToken & Document;

@Schema({ collection: 'zoho_tokens', timestamps: true })
export class ZohoToken {
  @Prop({ required: true, unique: true, default: 'primary' })
  key: string;

  @Prop()
  accessToken?: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  apiDomain?: string;

  @Prop()
  expiresAt?: Date;

  @Prop()
  lastRefreshError?: string;

  @Prop()
  lastRefreshedAt?: Date;
}

export const ZohoTokenSchema = SchemaFactory.createForClass(ZohoToken);

ZohoTokenSchema.index({ key: 1 }, { unique: true });
