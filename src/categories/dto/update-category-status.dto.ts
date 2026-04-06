import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class UpdateCategoryStatusDto {
  @ApiProperty({ example: 1, description: 'category_status value' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  category_status: number;
}
