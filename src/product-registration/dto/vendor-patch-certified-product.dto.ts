import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

function omitEmptyOptional(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

/**
 * Vendor edit payload for certified product list popup.
 * Supports patching only fields exposed in vendor UI.
 */
export class VendorPatchCertifiedProductDto {
  @ApiPropertyOptional({ example: 'UltraTech Weather Plus V5' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ example: 'High-performance weather-resistant cement.' })
  @Transform(({ value }) =>
    value === undefined || value === null ? value : String(value),
  )
  @IsOptional()
  @IsString()
  productDetails?: string;
}
