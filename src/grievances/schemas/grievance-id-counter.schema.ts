import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GrievanceIdCounterDocument = GrievanceIdCounter & Document;

export const GRIEVANCE_ID_COUNTER_KEY = 'grievance';

@Schema({ collection: 'grievance_id_counter' })
export class GrievanceIdCounter {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, required: true, default: 0 })
  seq: number;
}

export const GrievanceIdCounterSchema =
  SchemaFactory.createForClass(GrievanceIdCounter);
