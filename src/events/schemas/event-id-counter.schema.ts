import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventIdCounterDocument = EventIdCounter & Document;

export const EVENT_ID_COUNTER_KEY = 'event';

@Schema({ collection: 'event_id_counter' })
export class EventIdCounter {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true, default: 0 })
  seq: number;
}

export const EventIdCounterSchema = SchemaFactory.createForClass(EventIdCounter);

