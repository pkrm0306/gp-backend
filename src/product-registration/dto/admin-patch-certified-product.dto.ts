import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Allow,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

function omitEmptyOptional(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

/** Multipart or JSON body for admin certified product edit (PATCH). */
export class AdminPatchCertifiedProductDto {
  @ApiProperty({ example: 'UltraTech Weather Plus V5' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 'High-performance weather-resistant cement.' })
  @Transform(({ value }) =>
    value === undefined || value === null ? '' : String(value),
  )
  @IsString()
  productDetails: string;

  @ApiProperty({ example: 'URN-20260527122016' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({ example: 'GPABC001001' })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsString()
  @IsNotEmpty()
  eoiNo: string;

  @ApiPropertyOptional({
    description:
      'Read-only on certified edit — omit or send the unchanged category id. Category cannot be modified for certified products.',
  })
  @Transform(({ value }) => omitEmptyOptional(value))
  @IsOptional()
  @ValidateIf((_, value) => value !== undefined)
  @IsMongoId()
  categoryId?: string;

  @ApiProperty({
    description: 'Valid till date (ISO 8601 date or datetime)',
    example: '2028-12-31',
  })
  @Transform(({ value, obj }) =>
    omitEmptyOptional(value ?? obj?.validTillDate),
  )
  @IsNotEmpty({ message: 'validtillDate is required' })
  @IsDateString()
  validtillDate: string;

  @Allow()
  validTillDate?: string;

  /** Multipart: `1` / `true` clears the stored product image. */
  @Allow()
  remove_image?: string;

  @Allow()
  delete_image?: string;
}
