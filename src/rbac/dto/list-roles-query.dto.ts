import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class ListRolesQueryDto {
  @ApiPropertyOptional({ description: '1-based page; omit with limit for unpaged (all roles).' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || String(value).trim() === '') {
      return undefined;
    }
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) ? n : undefined;
  })
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Page size (max 100). Omit with page for unpaged.',
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || String(value).trim() === '') {
      return undefined;
    }
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) ? n : undefined;
  })
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Case-insensitive match on role name, description, or any permission string',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  @IsString()
  @MaxLength(200)
  search?: string;

  @ApiPropertyOptional({ enum: ['name', 'id', 'createdAt'] })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return undefined;
    const s = String(value).trim().toLowerCase();
    if (s === 'createdat') return 'createdAt';
    if (s === 'name' || s === 'id') return s;
    return String(value).trim();
  })
  @IsIn(['name', 'id', 'createdAt'])
  sort?: 'name' | 'id' | 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim().toLowerCase(),
  )
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
