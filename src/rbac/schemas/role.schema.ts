import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ collection: 'roles', timestamps: true })
export class Role {
  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: false, default: null })
  manufacturerId?: Types.ObjectId | null;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ default: 1 })
  status: number; // 1 active, 0 disabled

  createdAt?: Date;
  updatedAt?: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: {
      $or: [
        { manufacturerId: null },
        { manufacturerId: { $exists: false } },
      ],
    },
  },
);
RoleSchema.index(
  { manufacturerId: 1, name: 1 },
  {
    unique: true,
    partialFilterExpression: {
      manufacturerId: { $exists: true, $type: 'objectId' },
    },
  },
);

