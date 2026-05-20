import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/** Body for PATCH /admin/urn/:urn/status (urnNo may come from path). */
export class AdminPatchUrnStatusBodyDto {
  @ApiPropertyOptional({
    description: 'Optional when URN is provided in the URL path',
    example: 'URN-20260303140911',
  })
  @IsOptional()
  @IsString()
  urnNo?: string;

  @ApiProperty({
    enum: ['urn_status', 'product_status'],
    example: 'urn_status',
  })
  @IsString()
  @IsIn(['urn_status', 'product_status'])
  updateStatusType: 'urn_status' | 'product_status';

  @ApiProperty({
    description:
      'Target value. `urn_status`: 0–11. `product_status`: 0–3.',
    example: 6,
    minimum: 0,
    maximum: 11,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(11)
  updateStatusTo: number;
}
