import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

function trimString(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim();
}

/**
 * Public website product share — sends a rich HTML email (Outlook-ready card)
 * matching the product share mockup (image, badges, details, CTA).
 */
export class ShareProductByEmailDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'colleague@example.com',
  })
  @Transform(({ value }) => trimString(value).toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 'UltraTech Weather Plus' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  productName: string;

  @ApiPropertyOptional({ example: 'UltraTech Cement Ltd' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(300)
  manufacturerName?: string;

  @ApiPropertyOptional({ example: 'GPNE042002', description: 'Display product / EOI code' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(100)
  productCode?: string;

  @ApiPropertyOptional({ example: 'GPABC001001' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(100)
  eoiNo?: string;

  @ApiPropertyOptional({ example: 'URN-20260527122016' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(100)
  urnNo?: string;

  @ApiPropertyOptional({
    description: 'Absolute product detail / share URL',
    example: 'https://greenpro.cii.in/ecolabelled-products/product/abc',
  })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  shareUrl?: string;

  @ApiPropertyOptional({
    description: 'Absolute product image URL',
  })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  imageUrl?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 'Automotive Steel' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(120)
  categoryName?: string;

  @ApiPropertyOptional({ example: 'STEEL', description: 'Short badge label' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(60)
  categoryBadge?: string;

  @ApiPropertyOptional({ example: '31-12-2026' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(40)
  validFrom?: string;

  @ApiPropertyOptional({ example: '31-12-2028' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(40)
  validTo?: string;

  @ApiPropertyOptional({ description: 'Mongo product _id (optional)' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  @MaxLength(64)
  productId?: string;
}
