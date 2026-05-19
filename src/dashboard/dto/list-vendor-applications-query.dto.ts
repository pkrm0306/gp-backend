import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListVendorApplicationsQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Scope table to this URN only (all EOIs/products under that batch). If omitted, uses the vendor’s latest URN — same as GET /vendor/dashboard progress.',
    example: 'URN-20260305124230',
  })
  @IsOptional()
  @IsString()
  urn?: string;

  @ApiPropertyOptional({
    description: 'Search within the scoped URN (EOI or product name)',
    example: 'GPPPK',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
