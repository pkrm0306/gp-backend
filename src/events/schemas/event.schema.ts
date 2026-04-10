import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ collection: 'events', timestamps: false })
export class Event {
  @Prop({ required: true, unique: true })
  eventId: number;

  @Prop({ required: true })
  eventName: string;

  /** Local upload path (e.g. /uploads/events/xxx.png) or absolute URL */
  @Prop()
  eventImage?: string;

  @Prop()
  eventDescription?: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop()
  eventStartTime?: string;

  @Prop()
  eventEndTime?: string;

  @Prop()
  eventLocation?: string;

  @Prop()
  contactPersonName?: string;

  @Prop()
  contactPersonDesignation?: string;

  @Prop()
  contactPersonEmail?: string;

  @Prop()
  contactPersonPhone?: string;

  /** Optional external registration URL */
  @Prop()
  registrationLink?: string;

  /** Optional brochure/attachment URL */
  @Prop()
  brochureLink?: string;

  @Prop({ required: true, type: Number, default: 1 })
  eventStatus: number; // 0=Inactive, 1=Active

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
