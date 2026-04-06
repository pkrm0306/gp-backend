import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

/** All fields optional — send at least one field and/or a new `image` file */
export class UpdateCategoryMultipartDto {
  @ApiPropertyOptional({ example: 'Wooden Products' })
  @IsOptional()
  @IsString()
  category_name?: string;

  @ApiPropertyOptional({ example: '1,3,2' })
  @IsOptional()
  @IsString()
  category_raw_material_forms?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  category_status?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sector?: number;
}
