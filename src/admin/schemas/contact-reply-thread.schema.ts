import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContactReplyThreadDocument = ContactReplyThread & Document;

@Schema({ _id: false })
export class ContactReplyEntry {
  @Prop({ required: true })
  adminReply: string;

  @Prop({ required: true, default: () => new Date() })
  repliedAt: Date;
}

const ContactReplyEntrySchema = SchemaFactory.createForClass(ContactReplyEntry);

@Schema({ collection: 'contact_reply_threads', timestamps: true })
export class ContactReplyThread {
  @Prop({ type: Types.ObjectId, required: true, unique: true, index: true })
  contactMessageId: Types.ObjectId;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: [ContactReplyEntrySchema], default: [] })
  conversations: ContactReplyEntry[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const ContactReplyThreadSchema =
  SchemaFactory.createForClass(ContactReplyThread);

