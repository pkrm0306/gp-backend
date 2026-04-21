import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StandardDocument = Standard & Document;

@Schema({ collection: 'standards' })
export class Standard {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  /** Stored relative path under uploads/ or same path segment for S3 key suffix, e.g. standards/1700000000_file.pdf */
  @Prop({ required: true })
  filename: string;

  /** Public URL (S3 HTTPS) or app path (/uploads/...) */
  @Prop({ required: false })
  file_url?: string;

  /** Where the binary lives */
  @Prop({ enum: ['local', 's3'], required: false })
  storage_type?: 'local' | 's3';

  /** Full S3 object key when storage_type is s3 (for delete) */
  @Prop({ required: false })
  s3_key?: string;

  @Prop({ required: true })
  original_filename: string;

  @Prop({ required: true })
  resource_standard_type: string;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: Date, required: true })
  created_at: Date;

  @Prop({ type: Date, required: true })
  updated_at: Date;
}

export const StandardSchema = SchemaFactory.createForClass(Standard);
