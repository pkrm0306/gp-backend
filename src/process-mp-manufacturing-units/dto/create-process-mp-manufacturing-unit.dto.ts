import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsIn, IsNumber } from 'class-validator';
import { IsOptionalNonNegativeNumber } from '../validators/optional-non-negative-number.decorator';
import { IsOptionalNumber } from '../validators/optional-number.decorator';
import { normalizeRenewableEnergyUtilization } from '../utils/normalize-renewable-energy.util';

export class CreateProcessMpManufacturingUnitDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({ description: 'Unit name', required: false, example: 'Unit A' })
  @IsString()
  @IsOptional()
  unitName?: string;

  @ApiProperty({
    description:
      "Renewable energy utilization (stored as yes/no; accepts 1/0, 2=no, booleans, off/none, etc.)",
    required: false,
    enum: ['yes', 'no'],
  })
  @Transform(({ value }) => normalizeRenewableEnergyUtilization(value))
  @IsOptional()
  @IsIn(['yes', 'no'])
  renewableEnergyUtilization?: 'yes' | 'no';

  @ApiProperty({
    description:
      'Existing unit id — when provided, updates that row instead of creating',
    required: false,
    example: 15,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  })
  @IsNumber()
  @IsOptional()
  processMpManufacturingUnitId?: number;

  @ApiProperty({ required: false }) @IsString() @IsOptional() ecdYear1?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() ecdYear2?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() ecdYear3?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ecdProductionUnit?: string;

  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdProductionYear1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdProductionYear2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdProductionYear3?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ecdElectricUnit?: string;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdElectricYear1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdElectricYear2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdElectricYear3?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ecdThermalUnitFuel1?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ecdThermalUnitFuel2?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ecdThermalUnitFuel3?: string;

  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdThermalFuel1Year1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdThermalFuel1Year2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdThermalFuel1Year3?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdThermalFuel2Year1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdThermalFuel2Year2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdThermalFuel2Year3?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdThermalFuel3Year1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdThermalFuel3Year2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdThermalFuel3Year3?: number;

  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdCalorificFuel1Year1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdCalorificFuel1Year2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdCalorificFuel1Year3?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdCalorificFuel2Year1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdCalorificFuel2Year2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdCalorificFuel2Year3?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdCalorificFuel3Year1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdCalorificFuel3Year2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  ecdCalorificFuel3Year3?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ecdTextareaNewUnits?: string;

  @ApiProperty({ required: false }) @IsString() @IsOptional() wcdYear1?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() wcdYear2?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() wcdYear3?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  wcdProductionUnit?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  wcdWaterUnit?: string;

  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  wcdProductionYear1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  wcdProductionYear2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  wcdProductionYear3?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  wcdWaterYear1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  wcdWaterYear2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  wcdWaterYear3?: number;

  @ApiProperty({ required: false }) @IsString() @IsOptional() reYear?: string;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  reSolarPhotovoltaic?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  reWind?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  reBiomass?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  reSolarThermal?: number;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reOthersUnit?: string;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  reOthers?: number;

  @ApiProperty({
    required: false,
    description: 'Offsite renewable power (0/1 or count)',
    example: 0,
  })
  @IsOptionalNonNegativeNumber()
  offsiteRenewablePower?: number;

  @ApiProperty({
    required: false,
    description: 'Status (0=Pending, 1=Completed)',
    enum: [0, 1],
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  processMpManufacturingUnitStatus?: number;

  @ApiProperty({
    required: false,
    description:
      'Bulk SEC balance (may be negative when derived from auto-calculation).',
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  })
  @IsOptionalNumber()
  calculateBulkSec?: number;
  @ApiProperty({
    required: false,
    description:
      'Bulk SWC balance (may be negative when derived from auto-calculation).',
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  })
  @IsOptionalNumber()
  calculateBulkSwc?: number;

  @ApiProperty({ required: false }) @IsString() @IsOptional() calculateBulkSecMultipled?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() calculateBulkSwcMultipled?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() measuresImplementedMpUnits?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() detailsOfRainWaterHarvestingMpUnits?: string;

}
