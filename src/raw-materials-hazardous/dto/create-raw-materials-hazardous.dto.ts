import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRawMaterialsHazardousDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    description: 'Hazardous raw materials details',
    example: 'Details of hazardous raw materials and handling controls.',
    required: false,
  })
  @IsString()
  @IsOptional()
  details?: string;
}
