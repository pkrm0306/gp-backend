import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class MeasureBenefitDto {
  @ApiProperty({
    description: 'Measures implemented (optional; at least one column per row may be filled)',
    example: 'Use of renewable energy sources in manufacturing',
    required: false,
  })
  @IsOptional()
  @IsString()
  measuresImplemented?: string;

  @ApiProperty({
    description: 'Benefits achieved (optional; at least one column per row may be filled)',
    example: 'Reduced carbon footprint by 30% and lower operational costs',
    required: false,
  })
  @IsOptional()
  @IsString()
  benefitsAchieved?: string;
}
