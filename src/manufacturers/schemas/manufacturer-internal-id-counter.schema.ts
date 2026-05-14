import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ManufacturerInternalIdCounterDocument = ManufacturerInternalIdCounter &
  Document;

/** Singleton key for the global manufacturer internal-id numeric sequence. */
export const MANUFACTURER_INTERNAL_ID_COUNTER_KEY = 'global';

@Schema({ collection: 'manufacturer_internal_id_counter' })
export class ManufacturerInternalIdCounter {
  @Prop({ type: String, required: true })
  _id: string;

  /**
   * Highest numeric suffix **1–9999** observed for the tail counter path (no FIFO reclaim).
   * Next new tail id uses **seq + 1** when {@link reclaimedSuffixFifo} is empty.
   * Values **1000+** are only issued after every **1…999** is in use.
   */
  @Prop({ type: Number, required: true, default: 0 })
  seq: number;

  /**
   * Freed numeric suffixes (from deletions), **FIFO**: next allocation pops from the front
   * before issuing **seq + 1**.
   */
  @Prop({ type: [Number], default: [] })
  reclaimedSuffixFifo?: number[];
}

export const ManufacturerInternalIdCounterSchema = SchemaFactory.createForClass(
  ManufacturerInternalIdCounter,
);
