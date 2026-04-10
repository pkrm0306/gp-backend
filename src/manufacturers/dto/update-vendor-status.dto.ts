import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';

export class UpdateVendorStatusDto {
  @ApiProperty({
    description:
      'Optional manufacturer verification flag. When set to 1, backend also forces vendor_status=1.',
    enum: [1],
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([1], { message: 'manufacturerStatus can only be 1 when provided' })
  manufacturerStatus?: 1;

  @ApiProperty({
    description: 'Vendor active status for verified manufacturer (0=inactive, 1=active)',
    enum: [0, 1],
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1], { message: 'vendor_status must be 0 or 1' })
  vendor_status?: 0 | 1;
}

