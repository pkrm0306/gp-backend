import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsMongoId, IsOptional, IsString } from 'class-validator';
import { normalizeNumberArray } from './admin-list-products.dto';

export class AdminListProductsFilterOptionsDto {
  @ApiPropertyOptional({
    description:
      'EOI productStatus scope for dropdown values. Default `[2]` (certified).',
    type: [Number],
    example: [2],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0, 1, 2, 3, 4], { each: true })
  status?: number[];

  @ApiPropertyOptional({
    description: 'Alias of `status`.',
    type: [Number],
    example: [2],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0, 1, 2, 3, 4], { each: true })
  productStatus?: number[];

  @ApiPropertyOptional({
    description: 'Snake_case alias of `status`.',
    type: [Number],
    example: [2],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0, 1, 2, 3, 4], { each: true })
  product_status?: number[];

  @ApiPropertyOptional({
    description:
      'Optional plant country scope when building city/state-related distinct values.',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId()
  countryId?: string;
}
