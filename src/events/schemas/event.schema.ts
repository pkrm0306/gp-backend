import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ collection: 'events', timestamps: false })
export class Event {
  @Prop({ required: true, unique: true })
  eventId: number;

  @Prop({ required: true })
  eventName: string;

  @Prop()
  eventDescription?: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop()
  eventLocation?: string;

  @Prop({ required: true, type: Number, default: 1 })
  eventStatus: number; // 0=Inactive, 1=Active

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
