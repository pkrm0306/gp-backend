import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StateDocument = State & Document;

@Schema({ timestamps: true })
export class State {
  @Prop({ type: Types.ObjectId, ref: 'Country' })
  countryId?: Types.ObjectId;

  // Support for existing data structure
  @Prop()
  country_id?: number;

  @Prop()
  country_code?: string;

  @Prop()
  country_name?: string;

  @Prop({ required: true })
  stateName: string;

  @Prop()
  stateCode?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const StateSchema = SchemaFactory.createForClass(State);
