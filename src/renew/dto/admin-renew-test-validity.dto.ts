import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AdminRenewTestValidityDto {
  @ApiProperty({ example: 'URN-20260528142848' })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'New validity date (YYYY-MM-DD or ISO)',
    example: '2026-03-01',
  })
  @IsDateString()
  validTillDate: string;

  @ApiPropertyOptional({
    description:
      'When true (default), closes prior cycle(s) and starts a fresh renewal cycle at urn_status 12',
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => value !== false && value !== 'false')
  @IsBoolean()
  startNewRenewalCycle?: boolean;
}
