import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListManufacturersQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Case-insensitive partial match on manufacturer name, vendor name, email, or GP internal ID',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive partial filter by manufacturerName',
  })
  @IsOptional()
  @IsString()
  manufacturerName?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive partial filter by gpInternalId',
  })
  @IsOptional()
  @IsString()
  gpInternalId?: string;

  @ApiPropertyOptional({
    description: 'Case-insensitive partial filter by manufacturerInitial',
  })
  @IsOptional()
  @IsString()
  manufacturerInitial?: string;

  @ApiPropertyOptional({
    description: '0 deleted / pending, 1 active, 2 unverified (per manufacturer_status semantics)',
    enum: [0, 1, 2],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsEnum([0, 1, 2])
  manufacturerStatus?: 0 | 1 | 2;

  @ApiPropertyOptional({
    description: 'Vendor lifecycle: 0 unverified, 1 active, 2 inactive',
    enum: [0, 1, 2],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsEnum([0, 1, 2])
  vendor_status?: 0 | 1 | 2;

  @ApiPropertyOptional({ enum: ['createdAt', 'manufacturerName'], default: 'createdAt' })
  @IsOptional()
  @IsEnum(['createdAt', 'manufacturerName'])
  sortBy?: 'createdAt' | 'manufacturerName' = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
