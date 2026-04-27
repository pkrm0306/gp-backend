import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';

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
