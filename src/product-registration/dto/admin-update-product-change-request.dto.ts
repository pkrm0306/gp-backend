import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

function trimString(value: unknown): string {
  return String(value ?? '').trim();
}

export class AdminUpdateProductChangeRequestDto {
  @ApiProperty({
    enum: ['pending', 'approved', 'rejected'],
    description: 'New request status',
    example: 'approved',
  })
  @Transform(({ value }) => trimString(value).toLowerCase())
  @IsString()
  @IsIn(['pending', 'approved', 'rejected'])
  status: 'pending' | 'approved' | 'rejected';

  @ApiPropertyOptional({
    description: 'Optional admin remarks for review decision',
    example: 'Approved after validating product label evidence.',
  })
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : trimString(value),
  )
  @IsOptional()
  @IsString()
  adminRemarks?: string;
}
