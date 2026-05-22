import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MeasureBenefitDto } from './measure-benefit.dto';

export class CreateProductDesignDto {
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
      'Strategies text (optional). Vendor requires at least one of strategies, measures, ecoVisionFile, or supportingDesignFile.',
    required: false,
  })
  @IsString()
  @IsOptional()
  strategies?: string;

  @ApiProperty({
    description: 'Legacy alias for strategies (typo kept for compatibility)',
    required: false,
  })
  @IsString()
  @IsOptional()
  statergies?: string;

  @ApiProperty({
    description: 'Product design status (0=Pending, 1=Completed)',
    example: 0,
    required: false,
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  productDesignStatus?: number;

  @ApiProperty({
    description:
      'JSON array — **replaces** all measures for this URN. Optional; rows may have one column filled. Send the full list on every save.',
    type: [MeasureBenefitDto],
    required: false,
    example: [
      {
        measuresImplemented: 'Use of renewable energy sources in manufacturing',
        benefitsAchieved:
          'Reduced carbon footprint by 30% and lower operational costs',
      },
      {
        measuresImplemented: 'Implementation of waste reduction programs',
        benefitsAchieved: 'Decreased waste disposal costs by 25%',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MeasureBenefitDto)
  measuresAndBenefits?: MeasureBenefitDto[];

  @ApiProperty({
    description:
      'JSON array of product document ids (_id or productDocumentId) to keep for eco vision. Omit to keep all existing eco docs on text-only save; send [] to clear.',
    required: false,
    example: '["507f1f77bcf86cd799439011"]',
  })
  @IsOptional()
  existingEcoVisionDocumentIds?: string[];

  @ApiProperty({
    description:
      'JSON array of product document ids to keep for supporting documents. Omit to keep all existing supporting docs on text-only save; send [] to clear.',
    required: false,
    example: '["507f1f77bcf86cd799439012"]',
  })
  @IsOptional()
  existingSupportingDocumentIds?: string[];
}
