import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Partial-save: numeric grid fields use required: false, default: 0 (was required: true).

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

  @Prop({ type: Number, required: false, default: 0 }) consumptionYear1: number;
  @Prop({ type: Number, required: false, default: 0 }) consumptionYear2: number;
  @Prop({ type: Number, required: false, default: 0 }) consumptionYear3: number;
  @Prop({ type: Number, required: false, default: 0 }) cement1: number;
  @Prop({ type: Number, required: false, default: 0 }) flyash1: number;
  @Prop({ type: Number, required: false, default: 0 }) coarseAggregate1: number;
  @Prop({ type: Number, required: false, default: 0 }) fineAggregate1: number;
  @Prop({ type: Number, required: false, default: 0 }) admixture1: number;
  @Prop({ type: Number, required: false, default: 0 }) alcofine1: number;
  @Prop({ type: Number, required: false, default: 0 }) ggbs1: number;
  @Prop({ type: Number, required: false, default: 0 }) anyOtherMaterial1: number;
  @Prop({ type: Number, required: false, default: 0 }) total1: number;
  @Prop({ type: Number, required: false, default: 0 }) cement2: number;
  @Prop({ type: Number, required: false, default: 0 }) flyash2: number;
  @Prop({ type: Number, required: false, default: 0 }) coarseAggregate2: number;
  @Prop({ type: Number, required: false, default: 0 }) fineAggregate2: number;
  @Prop({ type: Number, required: false, default: 0 }) admixture2: number;
  @Prop({ type: Number, required: false, default: 0 }) alcofine2: number;
  @Prop({ type: Number, required: false, default: 0 }) ggbs2: number;
  @Prop({ type: Number, required: false, default: 0 }) anyOtherMaterial2: number;
  @Prop({ type: Number, required: false, default: 0 }) total2: number;
  @Prop({ type: Number, required: false, default: 0 }) cement3: number;
  @Prop({ type: Number, required: false, default: 0 }) flyash3: number;
  @Prop({ type: Number, required: false, default: 0 }) coarseAggregate3: number;
  @Prop({ type: Number, required: false, default: 0 }) fineAggregate3: number;
  @Prop({ type: Number, required: false, default: 0 }) admixture3: number;
  @Prop({ type: Number, required: false, default: 0 }) alcofine3: number;
  @Prop({ type: Number, required: false, default: 0 }) ggbs3: number;
  @Prop({ type: Number, required: false, default: 0 }) anyOtherMaterial3: number;
  @Prop({ type: Number, required: false, default: 0 }) total3: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear1: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear2: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear3: number;
  @Prop({ type: Number, required: false, default: 0 }) brandConcreteWithHighScm: number;
  @Prop({ type: Number, required: false, default: 0 }) brandHighStrengthConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) brandSelfCpmactingConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) brandLowDensityConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) brandClsmConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) brandAnyOtherTypes: number;
  @Prop({ type: Number, required: false, default: 0 }) brandTotalConcrete: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear1ConcreteWithHighScm: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear1HighStrengthConcrete: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear1SelfCpmactingConcrete: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear1LowDensityConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear1ClsmConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear1AnyOtherTypes: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear1TotalConcrete: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear2ConcreteWithHighScm: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear2HighStrengthConcrete: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear2SelfCpmactingConcrete: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear2LowDensityConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear2ClsmConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear2AnyOtherTypes: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear2TotalConcrete: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear3ConcreteWithHighScm: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear3HighStrengthConcrete: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear3SelfCpmactingConcrete: number;
  @Prop({ type: Number, required: false, default: 0 })
  productionYear3LowDensityConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear3ClsmConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear3AnyOtherTypes: number;
  @Prop({ type: Number, required: false, default: 0 }) productionYear3TotalConcrete: number;
  @Prop({ type: Number, required: false, default: 0 }) totalYear: number;
  @Prop({ type: Number, required: false, default: 0 }) totalQuantityOfOpcUsed: number;
  @Prop({ type: Number, required: false, default: 0 }) totalQuantityOfSupplementary: number;
  @Prop({ type: Number, required: false, default: 0 }) opcSubstitution: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear1Iron: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear2Iron: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear3Iron: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear4Iron: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear1Steel: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear2Steel: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear3Steel: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear4Steel: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear1Recycled: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear2Recycled: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear3Recycled: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear4Recycled: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear1SubsititutionIron: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear2SubsititutionIron: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear3SubsititutionIron: number;
  @Prop({ type: Number, required: false, default: 0 }) percentYear4SubsititutionIron: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear1SubsititutionSteel: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear2SubsititutionSteel: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear3SubsititutionSteel: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear4SubsititutionSteel: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear1SubsititutionCopper: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear2SubsititutionCopper: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear3SubsititutionCopper: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear4SubsititutionCopper: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear1SubsititutionRecycled: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear2SubsititutionRecycled: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear3SubsititutionRecycled: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear4SubsititutionRecycled: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear1SubsititutionAggregate: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear2SubsititutionAggregate: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear3SubsititutionAggregate: number;
  @Prop({ type: Number, required: false, default: 0 })
  percentYear4SubsititutionAggregate: number;
  @Prop({ type: Number, required: false, default: 0 }) plant1: number;
  @Prop({ type: Number, required: false, default: 0 }) plantYear1: number;
  @Prop({ type: Number, required: false, default: 0 }) plantYear2: number;
  @Prop({ type: Number, required: false, default: 0 }) plantYear3: number;
  @Prop({ type: Number, required: false, default: 0 }) plantYear4: number;
  @Prop({ type: Number, required: false, default: 0 }) plantYear1PercentSubstitution: number;
  @Prop({ type: Number, required: false, default: 0 }) plantYear2PercentSubstitution: number;
  @Prop({ type: Number, required: false, default: 0 }) plantYear3PercentSubstitution: number;
  @Prop({ type: Number, required: false, default: 0 }) plantYear4PercentSubstitution: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsUtilizationRmcSchema = SchemaFactory.createForClass(
  RawMaterialsUtilizationRmc,
);
