import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/** Optional renewal cycle scope on renew process POST bodies. */
export class RenewCycleScopeFields {
  @ApiProperty({
    required: false,
    example: '6a1edd713ec5008b997aca94',
    description: 'Renewal cycle scope (required when multiple cycles exist)',
  })
  @IsOptional()
  @IsString()
  renewalCycleId?: string;

  @ApiProperty({
    required: false,
    description: 'Snake-case alias for renewalCycleId',
  })
  @IsOptional()
  @IsString()
  renewal_cycle_id?: string;
}
