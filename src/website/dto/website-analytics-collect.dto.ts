import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class WebsiteAnalyticsEventDto {
  @ApiProperty({ enum: ['page_view', 'sign_up'] })
  @IsIn(['page_view', 'sign_up'])
  type: 'page_view' | 'sign_up';

  @ApiPropertyOptional({ example: '/products' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  path?: string;

  @ApiPropertyOptional({
    example: 'newsletter',
    description: 'Required when type is sign_up (newsletter, contact, lead, etc.)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  signUpType?: string;

  @ApiPropertyOptional({ description: 'Client event time (ISO). Defaults to server receive time.' })
  @IsOptional()
  @IsISO8601()
  timestamp?: string;
}

export class WebsiteAnalyticsCollectDto {
  @ApiProperty({
    example: 'v_8f3c2a1b9d4e',
    description: 'Stable anonymous id from localStorage on the public website',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  visitorId: string;

  @ApiPropertyOptional({
    example: 'G-KZB4S4WLCP',
    description: 'Optional GA4 measurement id when the client script is enabled',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  measurementId?: string;

  @ApiProperty({ type: [WebsiteAnalyticsEventDto] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => WebsiteAnalyticsEventDto)
  events: WebsiteAnalyticsEventDto[];
}
