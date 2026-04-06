import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StandardIdCounterDocument = StandardIdCounter & Document;

export const STANDARD_ID_COUNTER_KEY = 'standard';

@Schema({ collection: 'standard_id_counter' })
export class StandardIdCounter {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true, default: 0 })
  seq: number;
}

export const StandardIdCounterSchema = SchemaFactory.createForClass(StandardIdCounter);
