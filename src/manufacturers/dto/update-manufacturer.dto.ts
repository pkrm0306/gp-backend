import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateManufacturerDto {
  @ApiProperty({ description: 'Manufacturer name' })
  @Transform(({ value, obj }) => value ?? obj?.manufacturer_name)
  @IsString()
  @IsNotEmpty({ message: 'manufacturer_name is required' })
  manufacturerName: string;

  @ApiProperty({
    description:
      'GP Internal ID (format: 4 alphanumeric + "-" + 3 digits, e.g., GPSC-312)',
    example: 'GPSC-312',
  })
  @Transform(({ value, obj }) => value ?? obj?.gp_internal_id)
  @IsString()
  @IsNotEmpty({ message: 'gp_internal_id is required' })
  @Matches(/^[A-Za-z0-9]{4}-\d{3}$/, {
    message: 'gp_internal_id must match format XXXX-999 (example: GPSC-312)',
  })
  gpInternalId: string;

  @ApiProperty({ description: 'Manufacturer initial' })
  @Transform(({ value, obj }) => value ?? obj?.manufacturer_initial)
  @IsString()
  @IsNotEmpty({ message: 'manufacturer_initial is required' })
  manufacturerInitial: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vendor_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail({}, { message: 'vendor_email must be a valid email' })
  vendor_email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vendor_phone?: string;
}
