import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRawMaterialsEliminationOfFormaldehydeDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  urnNo: string;

  @ApiProperty({
    description: 'Products name',
    example: 'Low-VOC board material',
  })
  @IsString()
  @IsNotEmpty()
  productsName: string;

  @ApiProperty({
    description: 'Products test report details',
    example: 'Formaldehyde elimination test report details/reference',
  })
  @IsString()
  @IsNotEmpty()
  productsTestReport: string;

  @ApiProperty({
    description: 'Display name for uploaded supporting file',
    example: 'Formaldehyde Test Report - 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  formaldehydeFileName?: string;
}
