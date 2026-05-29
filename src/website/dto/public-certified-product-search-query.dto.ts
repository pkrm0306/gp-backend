import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

/** Typeahead query for public certified product search bar. */
export class PublicCertifiedProductSearchQueryDto {
  @ApiPropertyOptional({
    description: 'Search text (minimum 2 characters).',
    example: 'Solar',
  })
  @IsString()
  @MinLength(2)
  q: string;

  @ApiPropertyOptional({
    default: 15,
    description: 'Max suggestions to return.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(30)
  limit?: number = 15;
}
