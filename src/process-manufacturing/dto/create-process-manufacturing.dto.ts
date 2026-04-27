import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateProcessManufacturingDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Portable water demand (text)',
    example: 'Water demand details',
    required: false,
  })
  @IsString()
  @IsOptional()
  portableWaterDemand?: string;

  @ApiProperty({
    description: 'Rain water harvesting (text)',
    example: 'Rain water harvesting details',
    required: false,
  })
  @IsString()
  @IsOptional()
  rainWaterHarvesting?: string;

  @ApiProperty({
    description: 'Beyond the fence initiatives (text)',
    example: 'Beyond the fence initiatives details',
    required: false,
  })
  @IsString()
  @IsOptional()
  beyondTheFenceInitiatives?: string;

  @ApiProperty({
    description: 'Total energy consumption',
    example: 5000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  totalEnergyConsumption?: number;

  @ApiProperty({
    description: 'Process manufacturing status (0=Pending, 1=Completed)',
    example: 0,
    required: false,
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  processManufacturingStatus?: number;

  @ApiProperty({
    description:
      'Energy conservation supporting documents display name (required if uploading energyConservationSupportingDocumentsFile)',
    example: 'Energy Conservation Supporting Documents - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  energyConservationSupportingDocumentsFileName?: string;

  @ApiProperty({
    description:
      'Energy consumption documents display name (required if uploading energyConsumptionDocumentsFile)',
    example: 'Energy Consumption Documents - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  energyConsumptionDocumentsFileName?: string;
}
