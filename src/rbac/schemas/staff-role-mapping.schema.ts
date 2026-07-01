import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StaffRoleMappingDocument = StaffRoleMapping & Document;

@Schema({ collection: 'staff_role_mappings', timestamps: true })
export class StaffRoleMapping {
  @Prop({ type: Types.ObjectId, ref: 'Manufacturer', required: false, default: null })
  manufacturerId?: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'VendorUser', required: true })
  vendorUserId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  roleId: Types.ObjectId;

  @Prop({ default: 1 })
  status: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const StaffRoleMappingSchema =
  SchemaFactory.createForClass(StaffRoleMapping);
StaffRoleMappingSchema.index(
  { vendorUserId: 1, roleId: 1 },
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
StaffRoleMappingSchema.index(
  { manufacturerId: 1, vendorUserId: 1, roleId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      manufacturerId: { $exists: true, $type: 'objectId' },
    },
  },
);

