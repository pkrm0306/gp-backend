import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawMaterialsUtilizationRmcDocument = RawMaterialsUtilizationRmc &
  Document;

@Schema({ collection: 'raw_materials_utilization_rmc', timestamps: false })
export class RawMaterialsUtilizationRmc {
  @Prop({ required: true, unique: true })
  rawMaterialsUtilizationRmcId: number;

  @Prop({ required: true })
  urnNo: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendorId: Types.ObjectId;

  @Prop({ type: Number, required: true }) consumptionYear1: number;
  @Prop({ type: Number, required: true }) consumptionYear2: number;
  @Prop({ type: Number, required: true }) consumptionYear3: number;
  @Prop({ type: Number, required: true }) cement1: number;
  @Prop({ type: Number, required: true }) flyash1: number;
  @Prop({ type: Number, required: true }) coarseAggregate1: number;
  @Prop({ type: Number, required: true }) fineAggregate1: number;
  @Prop({ type: Number, required: true }) admixture1: number;
  @Prop({ type: Number, required: true }) alcofine1: number;
  @Prop({ type: Number, required: true }) ggbs1: number;
  @Prop({ type: Number, required: true }) anyOtherMaterial1: number;
  @Prop({ type: Number, required: true }) total1: number;
  @Prop({ type: Number, required: true }) cement2: number;
  @Prop({ type: Number, required: true }) flyash2: number;
  @Prop({ type: Number, required: true }) coarseAggregate2: number;
  @Prop({ type: Number, required: true }) fineAggregate2: number;
  @Prop({ type: Number, required: true }) admixture2: number;
  @Prop({ type: Number, required: true }) alcofine2: number;
  @Prop({ type: Number, required: true }) ggbs2: number;
  @Prop({ type: Number, required: true }) anyOtherMaterial2: number;
  @Prop({ type: Number, required: true }) total2: number;
  @Prop({ type: Number, required: true }) cement3: number;
  @Prop({ type: Number, required: true }) flyash3: number;
  @Prop({ type: Number, required: true }) coarseAggregate3: number;
  @Prop({ type: Number, required: true }) fineAggregate3: number;
  @Prop({ type: Number, required: true }) admixture3: number;
  @Prop({ type: Number, required: true }) alcofine3: number;
  @Prop({ type: Number, required: true }) ggbs3: number;
  @Prop({ type: Number, required: true }) anyOtherMaterial3: number;
  @Prop({ type: Number, required: true }) total3: number;
  @Prop({ type: Number, required: true }) productionYear1: number;
  @Prop({ type: Number, required: true }) productionYear2: number;
  @Prop({ type: Number, required: true }) productionYear3: number;
  @Prop({ type: Number, required: true }) brandConcreteWithHighScm: number;
  @Prop({ type: Number, required: true }) brandHighStrengthConcrete: number;
  @Prop({ type: Number, required: true }) brandSelfCpmactingConcrete: number;
  @Prop({ type: Number, required: true }) brandLowDensityConcrete: number;
  @Prop({ type: Number, required: true }) brandClsmConcrete: number;
  @Prop({ type: Number, required: true }) brandAnyOtherTypes: number;
  @Prop({ type: Number, required: true }) brandTotalConcrete: number;
  @Prop({ type: Number, required: true })
  productionYear1ConcreteWithHighScm: number;
  @Prop({ type: Number, required: true })
  productionYear1HighStrengthConcrete: number;
  @Prop({ type: Number, required: true })
  productionYear1SelfCpmactingConcrete: number;
  @Prop({ type: Number, required: true })
  productionYear1LowDensityConcrete: number;
  @Prop({ type: Number, required: true }) productionYear1ClsmConcrete: number;
  @Prop({ type: Number, required: true }) productionYear1AnyOtherTypes: number;
  @Prop({ type: Number, required: true }) productionYear1TotalConcrete: number;
  @Prop({ type: Number, required: true })
  productionYear2ConcreteWithHighScm: number;
  @Prop({ type: Number, required: true })
  productionYear2HighStrengthConcrete: number;
  @Prop({ type: Number, required: true })
  productionYear2SelfCpmactingConcrete: number;
  @Prop({ type: Number, required: true })
  productionYear2LowDensityConcrete: number;
  @Prop({ type: Number, required: true }) productionYear2ClsmConcrete: number;
  @Prop({ type: Number, required: true }) productionYear2AnyOtherTypes: number;
  @Prop({ type: Number, required: true }) productionYear2TotalConcrete: number;
  @Prop({ type: Number, required: true })
  productionYear3ConcreteWithHighScm: number;
  @Prop({ type: Number, required: true })
  productionYear3HighStrengthConcrete: number;
  @Prop({ type: Number, required: true })
  productionYear3SelfCpmactingConcrete: number;
  @Prop({ type: Number, required: true })
  productionYear3LowDensityConcrete: number;
  @Prop({ type: Number, required: true }) productionYear3ClsmConcrete: number;
  @Prop({ type: Number, required: true }) productionYear3AnyOtherTypes: number;
  @Prop({ type: Number, required: true }) productionYear3TotalConcrete: number;
  @Prop({ type: Number, required: true }) totalYear: number;
  @Prop({ type: Number, required: true }) totalQuantityOfOpcUsed: number;
  @Prop({ type: Number, required: true }) totalQuantityOfSupplementary: number;
  @Prop({ type: Number, required: true }) opcSubstitution: number;
  @Prop({ type: Number, required: true }) percentYear1Iron: number;
  @Prop({ type: Number, required: true }) percentYear2Iron: number;
  @Prop({ type: Number, required: true }) percentYear3Iron: number;
  @Prop({ type: Number, required: true }) percentYear4Iron: number;
  @Prop({ type: Number, required: true }) percentYear1Steel: number;
  @Prop({ type: Number, required: true }) percentYear2Steel: number;
  @Prop({ type: Number, required: true }) percentYear3Steel: number;
  @Prop({ type: Number, required: true }) percentYear4Steel: number;
  @Prop({ type: Number, required: true }) percentYear1Recycled: number;
  @Prop({ type: Number, required: true }) percentYear2Recycled: number;
  @Prop({ type: Number, required: true }) percentYear3Recycled: number;
  @Prop({ type: Number, required: true }) percentYear4Recycled: number;
  @Prop({ type: Number, required: true }) percentYear1SubsititutionIron: number;
  @Prop({ type: Number, required: true }) percentYear2SubsititutionIron: number;
  @Prop({ type: Number, required: true }) percentYear3SubsititutionIron: number;
  @Prop({ type: Number, required: true }) percentYear4SubsititutionIron: number;
  @Prop({ type: Number, required: true })
  percentYear1SubsititutionSteel: number;
  @Prop({ type: Number, required: true })
  percentYear2SubsititutionSteel: number;
  @Prop({ type: Number, required: true })
  percentYear3SubsititutionSteel: number;
  @Prop({ type: Number, required: true })
  percentYear4SubsititutionSteel: number;
  @Prop({ type: Number, required: true })
  percentYear1SubsititutionCopper: number;
  @Prop({ type: Number, required: true })
  percentYear2SubsititutionCopper: number;
  @Prop({ type: Number, required: true })
  percentYear3SubsititutionCopper: number;
  @Prop({ type: Number, required: true })
  percentYear4SubsititutionCopper: number;
  @Prop({ type: Number, required: true })
  percentYear1SubsititutionRecycled: number;
  @Prop({ type: Number, required: true })
  percentYear2SubsititutionRecycled: number;
  @Prop({ type: Number, required: true })
  percentYear3SubsititutionRecycled: number;
  @Prop({ type: Number, required: true })
  percentYear4SubsititutionRecycled: number;
  @Prop({ type: Number, required: true })
  percentYear1SubsititutionAggregate: number;
  @Prop({ type: Number, required: true })
  percentYear2SubsititutionAggregate: number;
  @Prop({ type: Number, required: true })
  percentYear3SubsititutionAggregate: number;
  @Prop({ type: Number, required: true })
  percentYear4SubsititutionAggregate: number;
  @Prop({ type: Number, required: true }) plant1: number;
  @Prop({ type: Number, required: true }) plantYear1: number;
  @Prop({ type: Number, required: true }) plantYear2: number;
  @Prop({ type: Number, required: true }) plantYear3: number;
  @Prop({ type: Number, required: true }) plantYear4: number;
  @Prop({ type: Number, required: true }) plantYear1PercentSubstitution: number;
  @Prop({ type: Number, required: true }) plantYear2PercentSubstitution: number;
  @Prop({ type: Number, required: true }) plantYear3PercentSubstitution: number;
  @Prop({ type: Number, required: true }) plantYear4PercentSubstitution: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsUtilizationRmcSchema = SchemaFactory.createForClass(
  RawMaterialsUtilizationRmc,
);
