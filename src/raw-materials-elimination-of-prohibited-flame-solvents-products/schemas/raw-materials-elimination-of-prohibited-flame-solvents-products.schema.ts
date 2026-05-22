import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RM_PARTIAL_TEXT } from '../../common/raw-materials/raw-materials-schema.props';

export type RawMaterialsEliminationOfProhibitedFlameSolventsProductsDocument =
  RawMaterialsEliminationOfProhibitedFlameSolventsProducts & Document;

@Schema({
  collection: 'raw_materials_elimination_of_prohibited_flame_solvents_products',
  timestamps: false,
})
export class RawMaterialsEliminationOfProhibitedFlameSolventsProducts {
  @Prop({ required: true, unique: true })
  rawMaterialsEliminationProhibitedFlameSolventsProductsId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  productsName: string;

  // @Prop({ required: true })
  @Prop(RM_PARTIAL_TEXT)
  productsTestReport: string;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsEliminationOfProhibitedFlameSolventsProductsSchema =
  SchemaFactory.createForClass(
    RawMaterialsEliminationOfProhibitedFlameSolventsProducts,
  );
