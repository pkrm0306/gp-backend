import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDeletionIdCounterDocument = AccountDeletionIdCounter &
  Document;

export const ACCOUNT_DELETION_ID_COUNTER_KEY = 'account_deletion';

@Schema({ collection: 'account_deletion_id_counter' })
export class AccountDeletionIdCounter {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true, default: 0 })
  seq: number;
}

export const AccountDeletionIdCounterSchema = SchemaFactory.createForClass(
  AccountDeletionIdCounter,
);
