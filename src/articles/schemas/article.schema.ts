import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ collection: 'articles', timestamps: true })
export class Article {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '', trim: true })
  description?: string;

  /** Plain-text teaser shown on cards when externalUrl is true. */
  @Prop({ default: '', trim: true })
  shortDescription?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: '', trim: true })
  image?: string;

  @Prop({ default: '', trim: true })
  article_image?: string;

  @Prop({ default: '', trim: true })
  url?: string;

  @Prop({ type: Boolean, default: false })
  externalUrl?: boolean;

  @Prop({ default: '', trim: true })
  pdf?: string;

  @Prop({ default: '', trim: true })
  article_pdf?: string;

  /** 1 = active, 0 = inactive */
  @Prop({ required: true, type: Number, default: 1 })
  status: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
