import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ManufacturerDocument = Manufacturer & Document;

@Schema({ timestamps: true })
export class Manufacturer {
  @Prop({ required: true })
  manufacturerName: string;

  @Prop({ required: true, unique: true })
  gpInternalId: string;

  @Prop({ required: true })
  manufacturerInitial: string;

  @Prop({ default: 1 })
  manufacturerStatus: number;

  @Prop()
  manufacturerImage?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ManufacturerSchema = SchemaFactory.createForClass(Manufacturer);
