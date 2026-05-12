import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRawMaterialsEliminationOfProhibitedFlameDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    description: 'Measures implemented',
    example:
      'Removed prohibited flame retardants and replaced with compliant alternatives.',
    required: false,
  })
  @IsString()
  @IsOptional()
  measuresImplemented?: string;

  @ApiProperty({
    description: 'Display name for uploaded supporting file',
    example: 'Prohibited Flame Elimination Supporting Document - 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  prohibitedFlameFileName?: string;
}
