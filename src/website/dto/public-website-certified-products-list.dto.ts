import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  normalizeMongoIdArray,
  normalizeOptionalString,
} from '../../product-registration/dto/admin-list-products.dto';

/** Body for public website certified product grid (no auth). */
export class PublicWebsiteCertifiedProductsListDto {
  @ApiPropertyOptional({
    description:
      'Multi-select category MongoDB ids. When set, only products in these categories are returned.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of categoryIds.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  category_ids?: string[];

  @ApiPropertyOptional({
    description:
      'Plant country MongoDB id. Use with stateIds for location filter.',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  countryId?: string;

  @ApiPropertyOptional({
    description: 'Snake_case alias of countryId.',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  country_id?: string;

  @ApiPropertyOptional({
    description: 'Multi-select plant state MongoDB ids (checkbox tree).',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  stateIds?: string[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of stateIds.',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeMongoIdArray(value))
  @IsArray()
  @IsMongoId({ each: true })
  state_ids?: string[];

  @ApiPropertyOptional({
    description:
      'Active search text (min 2 characters). Matches product name, EOI, URN, manufacturer.',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description:
      'When user picks a product from search suggestions, pass its MongoDB _id to show that product card.',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeOptionalString(value))
  @IsMongoId()
  productId?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 12;
}
