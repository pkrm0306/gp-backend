import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { SUMMIT_SPONSOR_TIERS, SUMMIT_STATUSES } from '../constants/summit.constants';
import { normalizeSummitStatus } from '../utils/summit-status.util';
import { normalizeSpeakerTags } from '../utils/summit-speaker.util';
class SummitBasicDto {
  @ApiPropertyOptional({ example: '2026' })
  @IsOptional()
  @IsString()
  @Matches(/^(19|20)\d{2}$/, { message: 'year must be a valid 4-digit year' })
  year?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: SUMMIT_STATUSES })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === '' ? undefined : normalizeSummitStatus(value),
  )
  @IsIn([...SUMMIT_STATUSES])
  status?: 'active' | 'inactive';
}

class SummitBannerDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() imageUrl?: string;
  /** Ignored — accepted for older clients; not stored */
  @IsOptional() @IsString() title?: string;
  /** Ignored — accepted for older clients; not stored */
  @IsOptional() @IsString() subtitle?: string;
}

class SummitPdfDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() fileUrl?: string;
  @IsOptional() @IsString() fileName?: string;
}

class SummitRichTextDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() content?: string;
}

class SummitTextItemDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() text?: string;
}

class SummitSpeakerDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() sub?: string;
  @ApiPropertyOptional({
    type: [String],
    example: ['Sustainability', 'Green buildings'],
    description: 'Speaker topic tags (array of strings). Required field on each speaker row — do not omit.',
  })
  @IsOptional()
  @Transform(({ value }) => normalizeSpeakerTags(value))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
  /** Alias of `tags` — accepted from frontend forms */
  @IsOptional()
  @Transform(({ value }) => normalizeSpeakerTags(value))
  @IsArray()
  @IsString({ each: true })
  keyPoints?: string[];
  @IsOptional() @IsString() imageUrl?: string;
}

class SummitSponsorDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsIn([...SUMMIT_SPONSOR_TIERS]) tier?: string;
  @IsOptional() @IsString() logoUrl?: string;
}

/** Full summit document for PATCH /admin/summits/:id */
export class UpdateSummitPayloadDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SummitBasicDto)
  basic?: SummitBasicDto;

  @ApiPropertyOptional({ type: [SummitBannerDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitBannerDto)
  banners?: SummitBannerDto[];

  @ApiPropertyOptional({ type: [SummitPdfDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitPdfDto)
  industrialPdfs?: SummitPdfDto[];

  @ApiPropertyOptional({ type: [SummitPdfDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitPdfDto)
  buildingsPdfs?: SummitPdfDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SummitRichTextDto)
  aboutGreenPro?: SummitRichTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SummitRichTextDto)
  aboutSummit?: SummitRichTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  highlightsTitle?: string;

  @ApiPropertyOptional({ type: [SummitTextItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitTextItemDto)
  highlights?: SummitTextItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  focusedAreaTitle?: string;

  @ApiPropertyOptional({ type: [SummitTextItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitTextItemDto)
  areaPoints?: SummitTextItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eventOutcomesTitle?: string;

  @ApiPropertyOptional({ type: [SummitTextItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitTextItemDto)
  eventOutcomes?: SummitTextItemDto[];

  @ApiPropertyOptional({ type: [SummitSpeakerDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitSpeakerDto)
  speakers?: SummitSpeakerDto[];

  @ApiPropertyOptional({
    description: 'Rich-text agenda (title + HTML content), same shape as aboutGreenPro',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SummitRichTextDto)
  agenda?: SummitRichTextDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sponsorsTitle?: string;

  @ApiPropertyOptional({ type: [SummitSponsorDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitSponsorDto)
  sponsors?: SummitSponsorDto[];
}
