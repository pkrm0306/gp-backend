import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class MeasureBenefitDto {
  @ApiProperty({
    description: 'Measures implemented',
    example: 'Use of renewable energy sources in manufacturing',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  measuresImplemented: string;

  @ApiProperty({
    description: 'Benefits achieved by the company or benefits to the end user',
    example: 'Reduced carbon footprint by 30% and lower operational costs',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  benefitsAchieved: string;
}
