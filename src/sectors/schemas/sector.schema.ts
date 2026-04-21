import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SectorDocument = Sector & Document;

@Schema({ collection: 'sectors' })
export class Sector {
  /** Integer primary key (auto-increment via counter) */
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  /** 1 = active, 0 = inactive */
  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: Date, required: true })
  created_at: Date;

  @Prop({ type: Date, required: true })
  updated_at: Date;

  /** Soft delete */
  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export const SectorSchema = SchemaFactory.createForClass(Sector);
