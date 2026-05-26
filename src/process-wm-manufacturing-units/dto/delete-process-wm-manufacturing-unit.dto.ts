import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DeleteProcessWmManufacturingUnitDto {
  @ApiProperty({ example: 'URN-20260305124230' })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({ example: 1, description: 'Numeric process_wm_manufacturing_units id' })
  @Type(() => Number)
  @IsInt()
  processWmManufacturingUnitId: number;
}
