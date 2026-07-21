import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Allow,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

function omitEmptyOptional(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

/** Multipart/JSON boolean: true|false|1|0|yes|no|on|off */
function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  const v = String(value).trim().toLowerCase();
  if (v === '1' || v === 'true' || v === 'yes' || v === 'on') {
    return true;
  }
  if (v === '0' || v === 'false' || v === 'no' || v === 'off') {
    return false;
  }
  return undefined;
}

function optionalSocialUrl(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return String(value);
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

  // --- Manufacturer social URLs (optional; aliases accepted from admin UI) ---

  @ApiPropertyOptional({ description: 'Manufacturer website URL' })
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  website?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  vendor_website?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  facebook?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  facebookUrl?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  facebook_url?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  youtube?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  youtubeUrl?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  youtube_url?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  twitter?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  twitterUrl?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  twitter_url?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  linkedin?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => optionalSocialUrl(value))
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  linkedin_url?: string;

  // --- Visibility toggles (camelCase + snake_case aliases) ---

  @ApiPropertyOptional({
    description:
      'Show manufacturer website URL on public product detail pages (default true).',
  })
  @Transform(({ value, obj }) =>
    parseOptionalBoolean(
      value ?? obj?.show_website_on_website ?? obj?.showWebsiteOnWebsite,
    ),
  )
  @IsOptional()
  @IsBoolean()
  showWebsiteOnWebsite?: boolean;

  @Allow()
  show_website_on_website?: boolean | string;

  @ApiPropertyOptional({
    description:
      'Show manufacturer Facebook on public product detail pages (default true).',
  })
  @Transform(({ value, obj }) =>
    parseOptionalBoolean(
      value ?? obj?.show_facebook_on_website ?? obj?.showFacebookOnWebsite,
    ),
  )
  @IsOptional()
  @IsBoolean()
  showFacebookOnWebsite?: boolean;

  @Allow()
  show_facebook_on_website?: boolean | string;

  @ApiPropertyOptional({
    description:
      'Show manufacturer YouTube on public product detail pages (default true).',
  })
  @Transform(({ value, obj }) =>
    parseOptionalBoolean(
      value ?? obj?.show_youtube_on_website ?? obj?.showYoutubeOnWebsite,
    ),
  )
  @IsOptional()
  @IsBoolean()
  showYoutubeOnWebsite?: boolean;

  @Allow()
  show_youtube_on_website?: boolean | string;

  @ApiPropertyOptional({
    description:
      'Show manufacturer Twitter/X on public product detail pages (default true).',
  })
  @Transform(({ value, obj }) =>
    parseOptionalBoolean(
      value ?? obj?.show_twitter_on_website ?? obj?.showTwitterOnWebsite,
    ),
  )
  @IsOptional()
  @IsBoolean()
  showTwitterOnWebsite?: boolean;

  @Allow()
  show_twitter_on_website?: boolean | string;

  @ApiPropertyOptional({
    description:
      'Show manufacturer LinkedIn on public product detail pages (default true).',
  })
  @Transform(({ value, obj }) =>
    parseOptionalBoolean(
      value ?? obj?.show_linkedin_on_website ?? obj?.showLinkedinOnWebsite,
    ),
  )
  @IsOptional()
  @IsBoolean()
  showLinkedinOnWebsite?: boolean;

  @Allow()
  show_linkedin_on_website?: boolean | string;
}
