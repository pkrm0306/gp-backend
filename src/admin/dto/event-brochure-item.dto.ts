import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  EVENT_BROCHURE_HEADING_MAX,
  EVENT_BROCHURE_LINK_MAX,
} from '../../events/utils/event-brochures.util';

export class EventBrochureItemDto {
  @ApiProperty({ example: 'GreenPro Summit Brochure' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @MaxLength(EVENT_BROCHURE_HEADING_MAX)
  heading: string;

  @ApiProperty({ example: 'https://example.com/brochure.pdf' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @MaxLength(EVENT_BROCHURE_LINK_MAX)
  link: string;
}
