import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class ZohoWebhookDto {
  @ApiPropertyOptional({ example: 'Lead_Conversion' })
  @IsOptional()
  @IsString()
  event?: string;

  @ApiPropertyOptional({ example: 'Leads' })
  @IsOptional()
  @IsString()
  module?: string;

  @ApiPropertyOptional({ example: '6424000000123456' })
  @IsOptional()
  @IsString()
  recordId?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;
}
