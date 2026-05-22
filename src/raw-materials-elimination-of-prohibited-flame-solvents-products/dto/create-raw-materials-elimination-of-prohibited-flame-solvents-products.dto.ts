import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  urnNo: string;

  @ApiProperty({
    description: 'Products name',
    example: 'Compliant solvent product',
  })
  @IsString()
  @IsOptional()
  productsName?: string;

  @ApiProperty({
    description: 'Products test report details',
    example: 'Prohibited flame solvents product test report details/reference',
    required: false,
  })
  @IsString()
  @IsOptional()
  productsTestReport?: string;
}
