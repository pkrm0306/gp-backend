import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

/** Body for PATCH /api/admin/products/urn-status — only these three fields (no remarks). */
export class AdminUpdateUrnStatusDto {
  @ApiProperty({ example: 'URN-20260303140911' })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Status field selector',
    enum: ['urn_status', 'product_status'],
    example: 'urn_status',
  })
  @IsString()
  @IsIn(['urn_status', 'product_status'])
  updateStatusType: 'urn_status' | 'product_status';

  @ApiProperty({
    description:
      'Target value for selected status field. `urn_status`: 0–11. `product_status`: 0–3.',
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
