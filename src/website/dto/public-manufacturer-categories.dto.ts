import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class PublicManufacturerCategoriesDto {
  @ApiProperty({
    description: 'Manufacturer MongoDB _id',
    example: '699562589f4eabba1869abbe',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  manufacturerId: string;
}

