import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsIn,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MeasureBenefitDto } from './measure-benefit.dto';

export class CreateProductDesignDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Strategies (text field)',
    required: false,
  })
  @IsString()
  @IsOptional()
  statergies?: string;

  @ApiProperty({
    description: 'Product design status (0=Pending, 1=Completed)',
    example: 0,
    required: false,
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  productDesignStatus?: number;

  @ApiProperty({
    description: 'Array of measures implemented and benefits achieved',
    type: [MeasureBenefitDto],
    required: false,
    example: [
      {
        measuresImplemented: 'Use of renewable energy sources in manufacturing',
        benefitsAchieved: 'Reduced carbon footprint by 30% and lower operational costs',
      },
      {
        measuresImplemented: 'Implementation of waste reduction programs',
        benefitsAchieved: 'Decreased waste disposal costs by 25%',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MeasureBenefitDto)
  measuresAndBenefits?: MeasureBenefitDto[];
}
