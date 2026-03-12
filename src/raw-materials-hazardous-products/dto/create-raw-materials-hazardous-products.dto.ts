import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRawMaterialsHazardousProductsDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Products name (text)',
    example: 'Lead-free solder paste',
    required: false,
  })
  @IsString()
  @IsOptional()
  productsName?: string;

  @ApiProperty({
    description: 'Products test report (text / link / reference)',
    example: 'Test report reference or summary',
    required: false,
  })
  @IsString()
  @IsOptional()
  productsTestReport?: string;

  @ApiProperty({
    description:
      'Test report display name (required if uploading productsTestReportFile). This is a user-provided label.',
    example: 'Hazardous Material Test Report - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  productsTestReportFileName?: string;
}

