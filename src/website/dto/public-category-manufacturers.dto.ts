import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class PublicCategoryManufacturersDto {
  @ApiProperty({
    description:
      'Category MongoDB `_id` (24-char hex) or numeric `category_id` from GET /categories',
    example: '6996ddcf14999ba875c7d691',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?:[0-9a-fA-F]{24}|\d+)$/, {
    message: 'categoryId must be a mongodb id or numeric category_id',
  })
  categoryId: string;
}
