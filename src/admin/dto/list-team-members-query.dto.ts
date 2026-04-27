import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListTeamMembersQueryDto {
  @ApiPropertyOptional({ example: 'active', description: 'active | inactive' })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  @IsString()
  @IsIn(['active', 'inactive', '1', '0'])
  status?: string;

  @ApiPropertyOptional({
    example: 'tester',
    description: 'Filter by designation',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : String(value).trim(),
  )
  @IsString()
  designation?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Transform(({ value }) => {
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) ? n : undefined;
  })
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Transform(({ value }) => {
    const n = Number.parseInt(String(value), 10);
    return Number.isFinite(n) ? n : undefined;
  })
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
