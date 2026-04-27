import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SectorIdCounterDocument = SectorIdCounter & Document;

export const SECTOR_ID_COUNTER_KEY = 'sector';

@Schema({ collection: 'sector_id_counter' })
export class SectorIdCounter {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true, default: 0 })
  seq: number;
}

export const SectorIdCounterSchema =
  SchemaFactory.createForClass(SectorIdCounter);
