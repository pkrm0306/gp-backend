import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

export class UpdateSectorStatusDto {
  @ApiProperty({ enum: [0, 1], description: '1 active, 0 inactive' })
  @Type(() => Number)
  @IsInt()
  @IsEnum([0, 1])
  status: 0 | 1;
}
