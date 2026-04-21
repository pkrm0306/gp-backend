import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRawMaterialsEliminationOfProhibitedFlameSolventsDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    description: 'Details',
    example:
      'Eliminated prohibited flame solvents and replaced with compliant alternatives.',
    required: false,
  })
  @IsString()
  @IsOptional()
  details?: string;
}
