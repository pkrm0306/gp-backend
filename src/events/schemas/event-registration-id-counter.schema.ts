import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventRegistrationIdCounterDocument = EventRegistrationIdCounter &
  Document;

export const EVENT_REGISTRATION_ID_COUNTER_KEY = 'event_registration';

@Schema({ collection: 'event_registration_id_counter' })
export class EventRegistrationIdCounter {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true, default: 0 })
  seq: number;
}

export const EventRegistrationIdCounterSchema = SchemaFactory.createForClass(
  EventRegistrationIdCounter,
);
