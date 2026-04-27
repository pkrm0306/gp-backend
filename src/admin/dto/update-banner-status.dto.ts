import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateBannerStatusDto {
  @ApiPropertyOptional({
    description:
      'Optional explicit status. If omitted, backend toggles current status.',
    examples: ['active', 'inactive'],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    if (value === true) return 'active';
    if (value === false) return 'inactive';
    return String(value).trim();
  })
  @IsIn(['active', 'inactive', '1', '0'])
  status?: 'active' | 'inactive' | '1' | '0';
}
