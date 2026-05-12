import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';

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
    description: "Renewable energy utilization ('yes' or 'no')",
    required: false,
    enum: ['yes', 'no'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['yes', 'no'])
  renewableEnergyUtilization?: 'yes' | 'no';

  @ApiProperty({ required: false }) @IsString() @IsOptional() ecdYear1?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() ecdYear2?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() ecdYear3?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ecdProductionUnit?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdProductionYear1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdProductionYear2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdProductionYear3?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ecdElectricUnit?: string;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdElectricYear1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdElectricYear2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
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
  @IsNumber()
  @IsOptional()
  ecdThermalFuel1Year1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdThermalFuel1Year2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdThermalFuel1Year3?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdThermalFuel2Year1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdThermalFuel2Year2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdThermalFuel2Year3?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdThermalFuel3Year1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdThermalFuel3Year2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdThermalFuel3Year3?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdCalorificFuel1Year1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdCalorificFuel1Year2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdCalorificFuel1Year3?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdCalorificFuel2Year1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdCalorificFuel2Year2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdCalorificFuel2Year3?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdCalorificFuel3Year1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  ecdCalorificFuel3Year2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
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
  @IsNumber()
  @IsOptional()
  wcdProductionYear1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  wcdProductionYear2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  wcdProductionYear3?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  wcdWaterYear1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  wcdWaterYear2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  wcdWaterYear3?: number;

  @ApiProperty({ required: false }) @IsString() @IsOptional() reYear?: string;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  reSolarPhotovoltaic?: number;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() reWind?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  reBiomass?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  reSolarThermal?: number;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  reOthersUnit?: string;
  @ApiProperty({ required: false }) @IsNumber() @IsOptional() reOthers?: number;

  @ApiProperty({
    required: false,
    description: 'Offsite renewable power (0/1 or count)',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  offsiteRenewablePower?: number;

  @ApiProperty({
    required: false,
    description: 'Status (0=Pending, 1=Completed)',
    enum: [0, 1],
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  @IsIn([0, 1])
  processMpManufacturingUnitStatus?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  calculateBulkSec?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  calculateBulkSwc?: number;

  @ApiProperty({ required: false }) @IsString() @IsOptional() calculateBulkSecMultipled?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() calculateBulkSwcMultipled?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() measuresImplementedMpUnits?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() detailsOfRainWaterHarvestingMpUnits?: string;

}
