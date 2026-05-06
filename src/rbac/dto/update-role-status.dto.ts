import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateRoleStatusDto {
  @ApiPropertyOptional({
    description: 'active | inactive (omit to toggle)',
    enum: ['active', 'inactive'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive', '1', '0'])
  status?: string;
}

