import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

/** Max images per article (1st = heading; all shown below What's inside). */
export const ARTICLE_MAX_IMAGES = 10;

@Schema({ _id: false })
export class ArticleKeyPoint {
  @Prop({ required: true, trim: true })
  heading: string;

  @Prop({ required: true, trim: true })
  description: string;
}

export const ArticleKeyPointSchema =
  SchemaFactory.createForClass(ArticleKeyPoint);

@Schema({ collection: 'articles', timestamps: true })
export class Article {
  @Prop({ required: true, trim: true })
  title: string;

  /** Publisher / source name shown on publication cards and detail. */
  @Prop({ default: '', trim: true })
  publisher?: string;

  @Prop({ default: '', trim: true })
  description?: string;

  /** Plain-text teaser shown on cards when externalUrl is true. */
  @Prop({ default: '', trim: true })
  shortDescription?: string;

  @Prop({ required: true })
  date: Date;

  /** Heading / card image — always mirrors `images[0]`. */
  @Prop({ default: '', trim: true })
  image?: string;

  @Prop({ default: '', trim: true })
  article_image?: string;

  /**
   * All article images (1–10). First is the heading image; the full set
   * (including the first) is rendered below the "What's inside" section.
   */
  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ default: '', trim: true })
  url?: string;

  @Prop({ type: Boolean, default: false })
  externalUrl?: boolean;

  /** Checklist bullets for the public "What's inside" section (max 50 chars each). */
  @Prop({ type: [String], default: [] })
  whatsInside?: string[];

  /** Numbered cards for the public "Key takeaways" / key points section. */
  @Prop({ type: [ArticleKeyPointSchema], default: [] })
  keyPoints?: ArticleKeyPoint[];

  /** Audience bullets for the public "Who it's for" section. */
  @Prop({ type: [String], default: [] })
  whoItsFor?: string[];

  /** Tag pills shown on the public article detail page. */
  @Prop({ type: [String], default: [] })
  tags?: string[];

  /** 1 = active, 0 = inactive */
  @Prop({ required: true, type: Number, default: 1 })
  status: number;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted?: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.index({ deletedAt: 1 });
