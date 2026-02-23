import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountryDocument = Country & Document;

@Schema({ timestamps: true })
export class Country {
  // Support for existing data structure
  @Prop()
  id?: number;

  @Prop({ required: true })
  countryName: string;

  @Prop()
  countryCode?: string;

  // Support for existing data structure
  @Prop()
  country_code?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
