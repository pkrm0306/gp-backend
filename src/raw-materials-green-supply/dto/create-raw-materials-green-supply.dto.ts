import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRawMaterialsGreenSupplyDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    description: 'Awareness and education details',
    example: 'Conducted green supply awareness sessions for procurement teams.',
    required: false,
  })
  @IsString()
  @IsOptional()
  awarenessAndEducation?: string;

  @ApiProperty({
    description: 'Measures implemented',
    example: 'Adopted green suppliers and sustainable sourcing checks.',
    required: false,
  })
  @IsString()
  @IsOptional()
  measuresImplemented?: string;
}
