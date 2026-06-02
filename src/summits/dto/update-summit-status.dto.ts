import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn } from 'class-validator';
import { SUMMIT_STATUSES } from '../constants/summit.constants';
import { normalizeSummitStatus } from '../utils/summit-status.util';

export class UpdateSummitStatusDto {
  @ApiProperty({ enum: SUMMIT_STATUSES, description: 'Active = visible on public site' })
  @Transform(({ value }) => normalizeSummitStatus(value))
  @IsIn([...SUMMIT_STATUSES])
  status: 'active' | 'inactive';
}
