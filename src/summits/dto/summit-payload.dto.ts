import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  SUMMIT_CMS_CARD_MAX,
  SUMMIT_CMS_FIELD_MAX,
  SUMMIT_CMS_FIELD_MIN,
  SUMMIT_FOCUS_POINTS_MAX,
  SUMMIT_SPONSOR_TIERS,
  SUMMIT_STATUSES,
} from '../constants/summit.constants';
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

  @IsOptional()
  @IsString()
  slug?: string;
}

class SummitBannerDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() title?: string;
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

class SummitCardItemDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() heading?: string;
  @IsOptional() @IsString() description?: string;
  /** Legacy flat bullet alias */
  @IsOptional() @IsString() text?: string;
  /** Legacy flat bullet alias used by admin CMS forms */
  @IsOptional() @IsString() point?: string;
  /** Legacy heading alias */
  @IsOptional() @IsString() title?: string;
  /** Legacy heading alias */
  @IsOptional() @IsString() label?: string;
}

class SummitFocusPointDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() text?: string;
  /** Legacy flat bullet alias */
  @IsOptional() @IsString() point?: string;
  /** Legacy aliases accepted on nested focus points */
  @IsOptional() @IsString() heading?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() description?: string;
}

class SummitFocusAreaCardDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() heading?: string;
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SUMMIT_FOCUS_POINTS_MAX)
  @ValidateNested({ each: true })
  @Type(() => SummitFocusPointDto)
  points?: SummitFocusPointDto[];
}

class SummitAgendaPointDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() heading?: string;
  @IsOptional() @IsString() description?: string;
  /** @deprecated legacy flat bullet — treated as description */
  @IsOptional() @IsString() text?: string;
  /** Legacy flat bullet alias */
  @IsOptional() @IsString() point?: string;
}

/** Legacy `areaPoints` rows may be flat bullets or topic cards with nested points. */
class SummitAreaPointCompatDto extends SummitAgendaPointDto {
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SUMMIT_FOCUS_POINTS_MAX)
  @ValidateNested({ each: true })
  @Type(() => SummitFocusPointDto)
  points?: SummitFocusPointDto[];
}

class SummitSpeakerDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() designation?: string;
  @IsOptional() @IsString() organisation?: string;
  @IsOptional() @IsString() organization?: string;
  @IsOptional() @IsString() sub?: string;
  @IsOptional() @IsString() keyPoint?: string;
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => normalizeSpeakerTags(value))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
  @IsOptional()
  @Transform(({ value }) => normalizeSpeakerTags(value))
  @IsArray()
  @IsString({ each: true })
  keyPoints?: string[];
  @IsOptional() @IsString() imageUrl?: string;
  /** Legacy alias for imageUrl on save. */
  @IsOptional() @IsString() image?: string;
  /** Legacy alias for imageUrl on save. */
  @IsOptional() @IsString() photoUrl?: string;
  /** Legacy alias for imageUrl on save. */
  @IsOptional() @IsString() photo?: string;
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

  @ApiPropertyOptional({
    minLength: SUMMIT_CMS_FIELD_MIN,
    maxLength: SUMMIT_CMS_FIELD_MAX,
  })
  @IsOptional()
  @IsString()
  highlightsTitle?: string;

  @ApiPropertyOptional({ type: [SummitCardItemDto], maxItems: SUMMIT_CMS_CARD_MAX })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SUMMIT_CMS_CARD_MAX)
  @ValidateNested({ each: true })
  @Type(() => SummitCardItemDto)
  highlights?: SummitCardItemDto[];

  @ApiPropertyOptional({
    minLength: SUMMIT_CMS_FIELD_MIN,
    maxLength: SUMMIT_CMS_FIELD_MAX,
  })
  @IsOptional()
  @IsString()
  focusedAreaTitle?: string;

  @ApiPropertyOptional({ type: [SummitFocusAreaCardDto], maxItems: SUMMIT_CMS_CARD_MAX })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SUMMIT_CMS_CARD_MAX)
  @ValidateNested({ each: true })
  @Type(() => SummitFocusAreaCardDto)
  focusedAreas?: SummitFocusAreaCardDto[];

  /** @deprecated legacy flat bullets — use focusedAreas */
  @ApiPropertyOptional({ type: [SummitAreaPointCompatDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitAreaPointCompatDto)
  areaPoints?: SummitAreaPointCompatDto[];

  @ApiPropertyOptional({
    minLength: SUMMIT_CMS_FIELD_MIN,
    maxLength: SUMMIT_CMS_FIELD_MAX,
  })
  @IsOptional()
  @IsString()
  eventOutcomesTitle?: string;

  @ApiPropertyOptional({ type: [SummitCardItemDto], maxItems: SUMMIT_CMS_CARD_MAX })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SUMMIT_CMS_CARD_MAX)
  @ValidateNested({ each: true })
  @Type(() => SummitCardItemDto)
  eventOutcomes?: SummitCardItemDto[];

  @ApiPropertyOptional({ type: [SummitSpeakerDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitSpeakerDto)
  speakers?: SummitSpeakerDto[];

  @ApiPropertyOptional({
    minLength: SUMMIT_CMS_FIELD_MIN,
    maxLength: SUMMIT_CMS_FIELD_MAX,
  })
  @IsOptional()
  @IsString()
  agendaTitle?: string;

  @ApiPropertyOptional({ type: [SummitAgendaPointDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SummitAgendaPointDto)
  agendaPoints?: SummitAgendaPointDto[];

  /** @deprecated legacy rich-text agenda — use agendaTitle + agendaPoints */
  @ApiPropertyOptional()
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

  @ApiPropertyOptional({ deprecated: true })
  @IsOptional()
  @IsString()
  slug?: string;
}
