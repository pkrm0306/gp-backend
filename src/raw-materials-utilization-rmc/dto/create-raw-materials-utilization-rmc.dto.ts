import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateRawMaterialsUtilizationRmcDto {
  @ApiProperty({ example: 'URN-20260305124230' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({ example: 1000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  consumptionYear1: number;

  @ApiProperty({ example: 1100 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  consumptionYear2: number;

  @ApiProperty({ example: 1200 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  consumptionYear3: number;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cement1: number;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  flyash1: number;

  @ApiProperty({ example: 300 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  coarseAggregate1: number;

  @ApiProperty({ example: 250 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  fineAggregate1: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  admixture1: number;

  @ApiProperty({ example: 15 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  alcofine1: number;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ggbs1: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  anyOtherMaterial1: number;

  @ApiProperty({ example: 750 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  total1: number;

  @ApiProperty({ example: 110 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cement2: number;

  @ApiProperty({ example: 55 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  flyash2: number;

  @ApiProperty({ example: 320 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  coarseAggregate2: number;

  @ApiProperty({ example: 260 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  fineAggregate2: number;

  @ApiProperty({ example: 11 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  admixture2: number;

  @ApiProperty({ example: 16 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  alcofine2: number;

  @ApiProperty({ example: 21 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ggbs2: number;

  @ApiProperty({ example: 6 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  anyOtherMaterial2: number;

  @ApiProperty({ example: 799 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  total2: number;

  @ApiProperty({ example: 120 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cement3: number;

  @ApiProperty({ example: 60 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  flyash3: number;

  @ApiProperty({ example: 330 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  coarseAggregate3: number;

  @ApiProperty({ example: 270 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  fineAggregate3: number;

  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  admixture3: number;

  @ApiProperty({ example: 17 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  alcofine3: number;

  @ApiProperty({ example: 22 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ggbs3: number;

  @ApiProperty({ example: 7 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  anyOtherMaterial3: number;

  @ApiProperty({ example: 838 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  total3: number;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear1: number;

  @ApiProperty({ example: 110 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear2: number;

  @ApiProperty({ example: 120 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear3: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  brandConcreteWithHighScm: number;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  brandHighStrengthConcrete: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  brandSelfCpmactingConcrete: number;

  @ApiProperty({ example: 8 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  brandLowDensityConcrete: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  brandClsmConcrete: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  brandAnyOtherTypes: number;

  @ApiProperty({ example: 48 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  brandTotalConcrete: number;

  @ApiProperty({ example: 11 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear1ConcreteWithHighScm: number;

  @ApiProperty({ example: 21 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear1HighStrengthConcrete: number;

  @ApiProperty({ example: 6 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear1SelfCpmactingConcrete: number;

  @ApiProperty({ example: 9 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear1LowDensityConcrete: number;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear1ClsmConcrete: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear1AnyOtherTypes: number;

  @ApiProperty({ example: 53 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear1TotalConcrete: number;

  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear2ConcreteWithHighScm: number;

  @ApiProperty({ example: 22 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear2HighStrengthConcrete: number;

  @ApiProperty({ example: 7 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear2SelfCpmactingConcrete: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear2LowDensityConcrete: number;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear2ClsmConcrete: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear2AnyOtherTypes: number;

  @ApiProperty({ example: 58 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear2TotalConcrete: number;

  @ApiProperty({ example: 13 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear3ConcreteWithHighScm: number;

  @ApiProperty({ example: 23 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear3HighStrengthConcrete: number;

  @ApiProperty({ example: 8 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear3SelfCpmactingConcrete: number;

  @ApiProperty({ example: 11 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear3LowDensityConcrete: number;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear3ClsmConcrete: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear3AnyOtherTypes: number;

  @ApiProperty({ example: 63 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  productionYear3TotalConcrete: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalYear: number;

  @ApiProperty({ example: 1000 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalQuantityOfOpcUsed: number;

  @ApiProperty({ example: 400 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalQuantityOfSupplementary: number;

  @ApiProperty({ example: 40 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  opcSubstitution: number;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear1Iron: number;

  @ApiProperty({ example: 11 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear2Iron: number;

  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear3Iron: number;

  @ApiProperty({ example: 13 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear4Iron: number;

  @ApiProperty({ example: 14 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear1Steel: number;

  @ApiProperty({ example: 15 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear2Steel: number;

  @ApiProperty({ example: 16 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear3Steel: number;

  @ApiProperty({ example: 17 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear4Steel: number;

  @ApiProperty({ example: 18 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear1Recycled: number;

  @ApiProperty({ example: 19 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear2Recycled: number;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear3Recycled: number;

  @ApiProperty({ example: 21 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear4Recycled: number;

  @ApiProperty({ example: 22 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear1SubsititutionIron: number;

  @ApiProperty({ example: 23 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear2SubsititutionIron: number;

  @ApiProperty({ example: 24 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear3SubsititutionIron: number;

  @ApiProperty({ example: 25 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear4SubsititutionIron: number;

  @ApiProperty({ example: 26 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear1SubsititutionSteel: number;

  @ApiProperty({ example: 27 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear2SubsititutionSteel: number;

  @ApiProperty({ example: 28 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear3SubsititutionSteel: number;

  @ApiProperty({ example: 29 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear4SubsititutionSteel: number;

  @ApiProperty({ example: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear1SubsititutionCopper: number;

  @ApiProperty({ example: 31 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear2SubsititutionCopper: number;

  @ApiProperty({ example: 32 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear3SubsititutionCopper: number;

  @ApiProperty({ example: 33 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear4SubsititutionCopper: number;

  @ApiProperty({ example: 34 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear1SubsititutionRecycled: number;

  @ApiProperty({ example: 35 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear2SubsititutionRecycled: number;

  @ApiProperty({ example: 36 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear3SubsititutionRecycled: number;

  @ApiProperty({ example: 37 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear4SubsititutionRecycled: number;

  @ApiProperty({ example: 38 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear1SubsititutionAggregate: number;

  @ApiProperty({ example: 39 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear2SubsititutionAggregate: number;

  @ApiProperty({ example: 40 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear3SubsititutionAggregate: number;

  @ApiProperty({ example: 41 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  percentYear4SubsititutionAggregate: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  plant1: number;

  @ApiProperty({ example: 2021 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  plantYear1: number;

  @ApiProperty({ example: 2022 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  plantYear2: number;

  @ApiProperty({ example: 2023 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  plantYear3: number;

  @ApiProperty({ example: 2024 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  plantYear4: number;

  @ApiProperty({ example: 15 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  plantYear1PercentSubstitution: number;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  plantYear2PercentSubstitution: number;

  @ApiProperty({ example: 25 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  plantYear3PercentSubstitution: number;

  @ApiProperty({ example: 30 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  plantYear4PercentSubstitution: number;
}
