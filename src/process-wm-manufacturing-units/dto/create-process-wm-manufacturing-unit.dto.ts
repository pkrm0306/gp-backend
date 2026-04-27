import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateProcessWmManufacturingUnitDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

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
  @IsNumber()
  @IsOptional()
  hazardousWasteProductionYear1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  hazardousWasteProductionYear2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  hazardousWasteProductionYear3?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  hazardousWasteQuantityYear1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  hazardousWasteQuantityYear2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
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
  @IsNumber()
  @IsOptional()
  nonHazardousWasteProductionYear1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  nonHazardousWasteProductionYear2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  nonHazardousWasteProductionYear3?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  nonHazardousWasteWaterYear1?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  nonHazardousWasteWaterYear2?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  nonHazardousWasteWaterYear3?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  calculateBulkRshwd?: number;
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
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
