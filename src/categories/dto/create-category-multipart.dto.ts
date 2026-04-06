import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

/**
 * Form fields for multipart POST /addCategory (field `image` is the file, not listed here).
 */
export class CreateCategoryMultipartDto {
  @ApiProperty({ example: 'Wooden Products' })
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @ApiPropertyOptional({
    example: '1,3,2',
    description: 'Comma-separated raw material form ids',
  })
  @IsOptional()
  @IsString()
  category_raw_material_forms?: string;

  @ApiPropertyOptional({ example: 1, description: '1 = active (default)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  category_status?: number;

  @ApiPropertyOptional({ example: 1, description: 'Sector id (defaults to 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sector?: number;
}
