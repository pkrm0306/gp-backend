import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class PublicCategoryManufacturersDto {
  @ApiProperty({
    description: 'Category MongoDB _id',
    example: '6996ddcf14999ba875c7d691',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;
}
