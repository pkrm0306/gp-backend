import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  Allow,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

/** Swagger/clients often send "" or null for unchanged optional fields — treat as omitted. */
function omitEmptyOptional(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'Solar Panel 100W Updated',
    required: true,
  })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiPropertyOptional({
    description: 'Product description text',
    example: 'Updated product description',
    required: true,
  })
  @Transform(({ value }) =>
    value === undefined || value === null ? value : String(value),
  )
  @IsString()
  productDetails: string;

  @ApiPropertyOptional({
    description: 'URN number (must match the product being updated)',
    example: 'URN-20260514165917',
    required: true,
  })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiPropertyOptional({
    description: 'EOI number (must match the product being updated)',
    example: 'GPABC001001',
    required: true,
  })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsString()
  @IsNotEmpty()
  eoiNo: string;

  @ApiPropertyOptional({ description: 'Product image URL' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsOptional()
  @IsString()
  productImage?: string;

  @ApiPropertyOptional({ description: 'Product type', example: 0 })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsOptional()
  @IsNumber()
  productType?: number;

  @ApiPropertyOptional({ description: 'Product status', example: 0 })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsOptional()
  @IsNumber()
  productStatus?: number;

  @ApiPropertyOptional({ description: 'Product renew status', example: 0 })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsOptional()
  @IsNumber()
  productRenewStatus?: number;

  @ApiPropertyOptional({ description: 'URN status', example: 0 })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsOptional()
  @IsNumber()
  urnStatus?: number;

  @ApiPropertyOptional({ description: 'Assessment report URL' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsOptional()
  @IsString()
  assessmentReportUrl?: string;

  @ApiPropertyOptional({ description: 'Rejected details' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsOptional()
  @IsString()
  rejectedDetails?: string;

  @ApiPropertyOptional({ description: 'Certified date (ISO 8601)', format: 'date-time' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @ValidateIf((_, value) => value !== undefined)
  @IsDateString()
  certifiedDate?: string;

  @ApiPropertyOptional({
    description: 'Valid till date (ISO 8601)',
    format: 'date-time',
    name: 'validtillDate',
  })
  @Transform(({ value, obj }) =>
    omitEmptyOptional(value ?? obj?.validTillDate),
  )
  @ValidateIf((_, value) => value !== undefined)
  @IsDateString()
  validtillDate?: string;

  /** Alias accepted from Swagger/clients (`validTillDate`); merged into `validtillDate` above. */
  @Allow()
  validTillDate?: string;

  @ApiPropertyOptional({ description: 'First notify date (ISO 8601)', format: 'date-time' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @ValidateIf((_, value) => value !== undefined)
  @IsDateString()
  firstNotifyDate?: string;

  @ApiPropertyOptional({ description: 'Second notify date (ISO 8601)', format: 'date-time' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @ValidateIf((_, value) => value !== undefined)
  @IsDateString()
  secondNotifyDate?: string;

  @ApiPropertyOptional({ description: 'Third notify date (ISO 8601)', format: 'date-time' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @ValidateIf((_, value) => value !== undefined)
  @IsDateString()
  thirdNotifyDate?: string;

  @ApiPropertyOptional({ description: 'Renewed date (ISO 8601)', format: 'date-time' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @ValidateIf((_, value) => value !== undefined)
  @IsDateString()
  renewedDate?: string;
}
