import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  Allow,
  ValidateIf,
  IsNotEmpty,
  IsMongoId,
} from 'class-validator';

/** Swagger/clients often send "" or null for unchanged optional fields — treat as omitted. */
function omitEmptyOptional(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  if (value === true || value === 'true' || value === 1 || value === '1') {
    return true;
  }
  if (value === false || value === 'false' || value === 0 || value === '0') {
    return false;
  }
  return undefined;
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

  @ApiPropertyOptional({
    description:
      'Category MongoDB ObjectId (admin EOI edit). Omit or send empty to leave unchanged.',
    example: '507f1f77bcf86cd799439011',
  })
  @Transform(({ value }) => omitEmptyOptional(value))
  @ValidateIf((_, value) => value !== undefined)
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({
    description:
      'Admin EOI edit — when changing category, if true, reset category-specific assessment/process data for the URN. ' +
      'Ignored when categoryId is unchanged. Defaults to false when omitted.',
    default: false,
  })
  @Transform(({ value }) => parseOptionalBoolean(value))
  @IsOptional()
  @IsBoolean()
  resetCategoryAssessmentData?: boolean;

  /**
   * Read-only echo from admin list/details — ignored; server resolves prior category from DB.
   */
  @Allow()
  previousCategoryId?: string;

  /** Read-only echo from category-change UI — ignored; send `categoryId` for the new value. */
  @Allow()
  newCategoryId?: string;

  /**
   * Read-only echoes from admin category-change preview / list row — ignored.
   * Server computes raw-material step purge/retain from old vs new category in DB.
   */
  @Allow()
  purgedRawMaterialStepIds?: unknown;

  @Allow()
  purgedSteps?: unknown;

  @Allow()
  retainedRawMaterialStepIds?: unknown;

  @Allow()
  retainedRawMaterialSteps?: unknown;

  @Allow()
  addedRawMaterialStepIds?: unknown;

  @Allow()
  addedRawMaterialSteps?: unknown;

  @Allow()
  visibleRawMaterialStepIds?: unknown;

  @Allow()
  visibleRawMaterialSteps?: unknown;

  @Allow()
  categoryChange?: unknown;

  @Allow()
  categoryEditable?: unknown;

  @Allow()
  categoryChangeBlockReason?: unknown;

  @Allow()
  vendorMustRefillRawMaterials?: unknown;

  @Allow()
  listRefreshRequired?: unknown;

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
