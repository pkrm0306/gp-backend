import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class DeleteUnverifiedManufacturerDto {
  @ApiProperty({ description: 'Manufacturer MongoDB _id' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'manufacturer_id must be a valid Mongo id' })
  manufacturer_id: string;
}
