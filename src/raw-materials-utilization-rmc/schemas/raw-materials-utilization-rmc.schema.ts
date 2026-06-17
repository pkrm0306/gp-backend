import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RM_PARTIAL_NUMBER } from '../../common/raw-materials/raw-materials-schema.props';

// Partial-save: numeric grid fields use RM_PARTIAL_NUMBER (null when unset; explicit 0 preserved).

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

  @Prop(RM_PARTIAL_NUMBER) consumptionYear1: number;
  @Prop(RM_PARTIAL_NUMBER) consumptionYear2: number;
  @Prop(RM_PARTIAL_NUMBER) consumptionYear3: number;
  @Prop(RM_PARTIAL_NUMBER) cement1: number;
  @Prop(RM_PARTIAL_NUMBER) flyash1: number;
  @Prop(RM_PARTIAL_NUMBER) coarseAggregate1: number;
  @Prop(RM_PARTIAL_NUMBER) fineAggregate1: number;
  @Prop(RM_PARTIAL_NUMBER) admixture1: number;
  @Prop(RM_PARTIAL_NUMBER) alcofine1: number;
  @Prop(RM_PARTIAL_NUMBER) ggbs1: number;
  @Prop(RM_PARTIAL_NUMBER) anyOtherMaterial1: number;
  @Prop(RM_PARTIAL_NUMBER) total1: number;
  @Prop(RM_PARTIAL_NUMBER) cement2: number;
  @Prop(RM_PARTIAL_NUMBER) flyash2: number;
  @Prop(RM_PARTIAL_NUMBER) coarseAggregate2: number;
  @Prop(RM_PARTIAL_NUMBER) fineAggregate2: number;
  @Prop(RM_PARTIAL_NUMBER) admixture2: number;
  @Prop(RM_PARTIAL_NUMBER) alcofine2: number;
  @Prop(RM_PARTIAL_NUMBER) ggbs2: number;
  @Prop(RM_PARTIAL_NUMBER) anyOtherMaterial2: number;
  @Prop(RM_PARTIAL_NUMBER) total2: number;
  @Prop(RM_PARTIAL_NUMBER) cement3: number;
  @Prop(RM_PARTIAL_NUMBER) flyash3: number;
  @Prop(RM_PARTIAL_NUMBER) coarseAggregate3: number;
  @Prop(RM_PARTIAL_NUMBER) fineAggregate3: number;
  @Prop(RM_PARTIAL_NUMBER) admixture3: number;
  @Prop(RM_PARTIAL_NUMBER) alcofine3: number;
  @Prop(RM_PARTIAL_NUMBER) ggbs3: number;
  @Prop(RM_PARTIAL_NUMBER) anyOtherMaterial3: number;
  @Prop(RM_PARTIAL_NUMBER) total3: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear1: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear2: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear3: number;
  @Prop(RM_PARTIAL_NUMBER) brandConcreteWithHighScm: number;
  @Prop(RM_PARTIAL_NUMBER) brandHighStrengthConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) brandSelfCpmactingConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) brandLowDensityConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) brandClsmConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) brandAnyOtherTypes: number;
  @Prop(RM_PARTIAL_NUMBER) brandTotalConcrete: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear1ConcreteWithHighScm: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear1HighStrengthConcrete: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear1SelfCpmactingConcrete: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear1LowDensityConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear1ClsmConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear1AnyOtherTypes: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear1TotalConcrete: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear2ConcreteWithHighScm: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear2HighStrengthConcrete: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear2SelfCpmactingConcrete: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear2LowDensityConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear2ClsmConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear2AnyOtherTypes: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear2TotalConcrete: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear3ConcreteWithHighScm: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear3HighStrengthConcrete: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear3SelfCpmactingConcrete: number;
  @Prop(RM_PARTIAL_NUMBER)
  productionYear3LowDensityConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear3ClsmConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear3AnyOtherTypes: number;
  @Prop(RM_PARTIAL_NUMBER) productionYear3TotalConcrete: number;
  @Prop(RM_PARTIAL_NUMBER) totalYear: number;
  @Prop(RM_PARTIAL_NUMBER) totalQuantityOfOpcUsed: number;
  @Prop(RM_PARTIAL_NUMBER) totalQuantityOfSupplementary: number;
  @Prop(RM_PARTIAL_NUMBER) opcSubstitution: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear1Iron: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear2Iron: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear3Iron: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear4Iron: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear1Steel: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear2Steel: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear3Steel: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear4Steel: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear1Recycled: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear2Recycled: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear3Recycled: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear4Recycled: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear1SubsititutionIron: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear2SubsititutionIron: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear3SubsititutionIron: number;
  @Prop(RM_PARTIAL_NUMBER) percentYear4SubsititutionIron: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear1SubsititutionSteel: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear2SubsititutionSteel: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear3SubsititutionSteel: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear4SubsititutionSteel: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear1SubsititutionCopper: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear2SubsititutionCopper: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear3SubsititutionCopper: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear4SubsititutionCopper: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear1SubsititutionRecycled: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear2SubsititutionRecycled: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear3SubsititutionRecycled: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear4SubsititutionRecycled: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear1SubsititutionAggregate: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear2SubsititutionAggregate: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear3SubsititutionAggregate: number;
  @Prop(RM_PARTIAL_NUMBER)
  percentYear4SubsititutionAggregate: number;
  @Prop(RM_PARTIAL_NUMBER) plant1: number;
  @Prop(RM_PARTIAL_NUMBER) plantYear1: number;
  @Prop(RM_PARTIAL_NUMBER) plantYear2: number;
  @Prop(RM_PARTIAL_NUMBER) plantYear3: number;
  @Prop(RM_PARTIAL_NUMBER) plantYear4: number;
  @Prop(RM_PARTIAL_NUMBER) plantYear1PercentSubstitution: number;
  @Prop(RM_PARTIAL_NUMBER) plantYear2PercentSubstitution: number;
  @Prop(RM_PARTIAL_NUMBER) plantYear3PercentSubstitution: number;
  @Prop(RM_PARTIAL_NUMBER) plantYear4PercentSubstitution: number;

  @Prop({ required: true })
  createdDate: Date;

  @Prop({ required: true })
  updatedDate: Date;
}

export const RawMaterialsUtilizationRmcSchema = SchemaFactory.createForClass(
  RawMaterialsUtilizationRmc,
);
