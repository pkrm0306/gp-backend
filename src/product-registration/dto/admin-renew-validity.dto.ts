import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminRenewValidityDto {
  @ApiProperty({
    description: 'URN number to update',
    example: 'URN-20260303140911',
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'New validity date (YYYY-MM-DD or ISO date string)',
    example: '2028-12-31',
  })
  @IsDateString()
  validTillDate: string;

  @ApiPropertyOptional({
    description: 'If true, resolves affected products without writing changes',
    default: false,
    example: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  preview?: boolean;

  @ApiPropertyOptional({
    description:
      'When true (default on PATCH /renew/admin/test-validity), starts a new renewal cycle. Set false for validity-only update.',
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === false || value === 'false') return false;
    if (value === true || value === 'true') return true;
    return undefined;
  })
  @IsBoolean()
  startNewRenewalCycle?: boolean;
}

