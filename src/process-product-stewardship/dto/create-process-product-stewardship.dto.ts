import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductStewardshipProgrammeDetailDto {
  @ApiProperty({
    description: 'Stakeholder education / awareness programme details',
    example: 'Training programme for dealers and retailers',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  programmeDetails: string;

  @ApiProperty({
    description: 'Number of programmes',
    example: '4',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  numberOfPrograms: string;
}

export class CreateProcessProductStewardshipDto {
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
      'Array of stakeholder education/awareness programmes (from programmeDetails payload)',
    required: false,
    type: [ProductStewardshipProgrammeDetailDto],
    example: [
      {
        programmeDetails: 'Training programme for channel partners',
        numberOfPrograms: '4',
      },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductStewardshipProgrammeDetailDto)
  programmeDetails?: ProductStewardshipProgrammeDetailDto[];

  @ApiProperty({
    description: 'Quality management details (text)',
    example: 'Quality management implementation details',
    required: false,
  })
  @IsString()
  @IsOptional()
  qualityManagementDetails?: string;

  @ApiProperty({
    description: 'EPR implemented details (text)',
    example: 'EPR implementation details',
    required: false,
  })
  @IsString()
  @IsOptional()
  eprImplementedDetails?: string;

  @ApiProperty({
    description: 'EPR green packaging details (text)',
    example: 'EPR green packaging details',
    required: false,
  })
  @IsString()
  @IsOptional()
  eprGreenPackagingDetails?: string;

  @ApiProperty({
    description: 'Product stewardship status (0=Pending, 1=Completed)',
    example: 0,
    required: false,
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  productStewardshipStatus?: number;

  @ApiProperty({
    description:
      'SEA supporting documents display name (required if uploading seaSupportingDocumentsFile)',
    example: 'SEA Supporting Documents - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  seaSupportingDocumentsFileName?: string;

  @ApiProperty({
    description:
      'Quality management supporting documents display name (required if uploading qmSupportingDocumentsFile)',
    example: 'Quality Management Supporting Documents - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  qmSupportingDocumentsFileName?: string;

  @ApiProperty({
    description:
      'EPR supporting documents display name (required if uploading eprSupportingDocumentsFile)',
    example: 'EPR Supporting Documents - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  eprSupportingDocumentsFileName?: string;
}
