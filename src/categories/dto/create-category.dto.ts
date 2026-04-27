import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

/** category_id is assigned only by the server — do not send it in the body */
export class CreateCategoryDto {
  @ApiProperty({ example: 'Architectural Products' })
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @ApiPropertyOptional({ example: '1577959974Architectural_Products.jpg' })
  @IsOptional()
  @IsString()
  category_image?: string;

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

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Sector id (defaults to 1 if omitted)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sector?: number;
}
