import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStandardMultipartDto {
  @ApiProperty({ example: 'Energy Efficiency Benchmark' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Benchmark details and applicability scope.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Energy' })
  @IsString()
  @IsNotEmpty()
  resource_standard_type: string;

  @ApiPropertyOptional({ enum: [0, 1], default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsEnum([0, 1])
  status?: 0 | 1;
}
