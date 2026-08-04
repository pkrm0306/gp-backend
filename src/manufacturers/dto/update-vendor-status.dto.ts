import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

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
    description:
      'Vendor active status for verified manufacturer (0=inactive, 1=active)',
    enum: [0, 1],
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1], { message: 'vendor_status must be 0 or 1' })
  vendor_status?: 0 | 1;

  @ApiProperty({
    description:
      'Required when setting vendor_status to 0 (deactivate). Max 500 characters. Ignored when activating.',
    required: false,
    maxLength: 500,
    example: 'Non-compliant documentation; account suspended pending re-submission.',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value),
  )
  @IsString()
  @MaxLength(500, {
    message: 'Remark must be at most 500 characters',
  })
  remark?: string;

  /** Alias for {@link remark} (admin UI / alternate clients). */
  @ApiProperty({
    description: 'Alias for remark',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value),
  )
  @IsString()
  @MaxLength(500, {
    message: 'Remark must be at most 500 characters',
  })
  deactivationRemark?: string;

  /** Alias for {@link remark} (some admin clients send `remarks`). */
  @ApiProperty({
    description: 'Alias for remark',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value),
  )
  @IsString()
  @MaxLength(500, {
    message: 'Remark must be at most 500 characters',
  })
  remarks?: string;
}
