import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { IsOptionalNonNegativeNumber } from '../../process-mp-manufacturing-units/validators/optional-non-negative-number.decorator';
import { IsOptionalNumber } from '../../process-mp-manufacturing-units/validators/optional-number.decorator';

export class CreateProcessWmManufacturingUnitDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description:
      'Existing unit id — when provided, updates that row instead of creating',
    required: false,
    example: 58,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  })
  @IsNumber()
  @IsOptional()
  processWmManufacturingUnitId?: number;

  @ApiProperty({ description: 'Process waste management ID', required: false })
  @IsNumber()
  @IsOptional()
  processWasteManagementId?: number;

  @ApiProperty({ description: 'Unit name', required: false, example: 'Unit A' })
  @IsString()
  @IsOptional()
  unitName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  hazardousWasteYear1?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  hazardousWasteYear2?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  hazardousWasteYear3?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  hazardousWasteProductionUnit?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  hazardousWasteQuantityUnit?: string;

  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  hazardousWasteProductionYear1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  hazardousWasteProductionYear2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  hazardousWasteProductionYear3?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  hazardousWasteQuantityYear1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  hazardousWasteQuantityYear2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  hazardousWasteQuantityYear3?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nonHazardousWasteYear1?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nonHazardousWasteYear2?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nonHazardousWasteYear3?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nonHazardousWasteProductionUnit?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nonHazardousWasteWaterUnit?: string;

  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  nonHazardousWasteProductionYear1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  nonHazardousWasteProductionYear2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  nonHazardousWasteProductionYear3?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  nonHazardousWasteWaterYear1?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  nonHazardousWasteWaterYear2?: number;
  @ApiProperty({ required: false })
  @IsOptionalNonNegativeNumber()
  nonHazardousWasteWaterYear3?: number;

  @ApiProperty({ required: false })
  @IsOptionalNumber()
  calculateBulkRshwd?: number;
  @ApiProperty({ required: false })
  @IsOptionalNumber()
  calculateBulkRsnhwd?: number;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  calculateBulkRshwdMultipled?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  calculateBulkRsnhwdMultipled?: string;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  wmImplementationDetailsWmUnits?: string;
}
