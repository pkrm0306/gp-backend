import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/** Technical or marketing contact row on a manufacturer (vendor portal). */
@Schema({ _id: false })
export class VendorContactSlot {
  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  email_id: string;

  @Prop({ default: '' })
  phone_number: string;

  @Prop({ default: '' })
  designation: string;

  /** 1 = Active (portal access), 0 = Inactive (portal access restricted). Default Active. */
  @Prop({ default: 1 })
  status: number;
}

export const VendorContactSlotSchema =
  SchemaFactory.createForClass(VendorContactSlot);
