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
}

export const VendorContactSlotSchema =
  SchemaFactory.createForClass(VendorContactSlot);
