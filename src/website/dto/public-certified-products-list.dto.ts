import { ApiPropertyOptional } from '@nestjs/swagger';
import { OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional } from 'class-validator';
import { AdminListProductsDto } from '../../product-registration/dto/admin-list-products.dto';

function normalizeNumberArray(value: unknown): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const source = Array.isArray(value) ? value : String(value).split(',');
  const parsed = source
    .map((v) => Number(String(v).trim()))
    .filter((v) => Number.isFinite(v));
  return parsed.length > 0 ? parsed : undefined;
}

/**
 * Same filters as {@link AdminListProductsDto} for public certified listing,
 * but `status` may include certified / rejected / expired codes (service still forces `[2]`).
 */
export class PublicCertifiedProductsListDto extends OmitType(
  AdminListProductsDto,
  ['status'] as const,
) {
  @ApiPropertyOptional({
    description:
      'Optional productStatus filter (public list still forces certified `[2]` in the service).',
    type: [Number],
    example: [2],
  })
  @IsOptional()
  @Transform(({ value }) => normalizeNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  @IsIn([0, 1, 2, 3, 4], { each: true })
  status?: number[];
}
