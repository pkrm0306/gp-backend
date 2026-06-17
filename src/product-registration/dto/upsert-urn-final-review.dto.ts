import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

function omitEmptyOptional(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

function parseOptionalNumber(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export class UpsertUrnFinalReviewDto {
  @ApiProperty({ example: 'URN-20260527122016' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiPropertyOptional({ description: 'Technical review notes (HTML/text)' })
  @Transform(({ value, obj }) =>
    omitEmptyOptional(value ?? obj?.technical_review),
  )
  @IsOptional()
  @IsString()
  technicalReview?: string;

  @ApiPropertyOptional({ description: 'Final review notes (HTML/text)' })
  @Transform(({ value, obj }) => omitEmptyOptional(value ?? obj?.final_review))
  @IsOptional()
  @IsString()
  finalReview?: string;

  @ApiPropertyOptional({ example: 50, description: 'Minimum credits achieved' })
  @Transform(({ value, obj }) =>
    parseOptionalNumber(value ?? obj?.min_credits),
  )
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minCredits?: number;

  @ApiPropertyOptional({ example: 85, description: 'Maximum credits achieved' })
  @Transform(({ value, obj }) =>
    parseOptionalNumber(value ?? obj?.max_credits),
  )
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxCredits?: number;

  @Allow()
  technical_review?: string;

  @Allow()
  final_review?: string;

  @Allow()
  min_credits?: number;

  @Allow()
  max_credits?: number;
}
