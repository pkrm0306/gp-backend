import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

function firstString(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      return String(v).trim();
    }
  }
  return undefined;
}

export class ListUrnSiteVisitsDto {
  @ApiProperty({ example: 'URN-20260514165917' })
  @Transform(({ obj, value }) => firstString(value, obj?.urn_no))
  @IsString()
  @IsNotEmpty()
  urnNo: string;

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

  @ApiPropertyOptional({ description: 'Search name, conductedBy, city' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ['createdAt', 'name', 'auditConductedOn', 'updatedAt'],
    default: 'createdAt',
  })
  @Transform(({ obj, value }) =>
    firstString(value, obj?.sort_by) ?? 'createdAt',
  )
  @IsOptional()
  @IsIn(['createdAt', 'name', 'auditConductedOn', 'updatedAt'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === 1)
  @IsBoolean()
  includeDeleted?: boolean = false;
}
