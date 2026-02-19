import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class UpdateManufacturerDto {
  @ApiProperty({ description: 'Manufacturer name' })
  @IsString()
  @IsNotEmpty()
  manufacturerName: string;

  @ApiProperty({
    description: 'GP Internal ID (format: 3-5 uppercase letters + "-" + 3 digits, e.g., GPSC-312)',
    example: 'GPSC-312',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3,5}-[0-9]{3}$/, {
    message: 'gpInternalId must be in format: 3-5 uppercase letters + "-" + 3 digits (e.g., GPSC-312)',
  })
  gpInternalId: string;

  @ApiProperty({ description: 'Manufacturer initial' })
  @IsString()
  @IsNotEmpty()
  manufacturerInitial: string;
}
