import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRawMaterialsUtilizationDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    description: 'Utilization details',
    example: 'Raw materials utilization strategy and implementation details.',
    required: false,
  })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiProperty({
    description: 'Display name for uploaded supporting file',
    example: 'Raw Materials Utilization Supporting Document - 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  utilizationFileName?: string;
}
