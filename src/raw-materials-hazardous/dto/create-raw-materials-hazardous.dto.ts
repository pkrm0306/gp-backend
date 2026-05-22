import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  RAW_MATERIALS_EOI_NO_MAX_LENGTH,
  RAW_MATERIALS_URN_MAX_LENGTH,
} from '../../common/raw-materials/raw-materials-upload.util';

export class CreateRawMaterialsHazardousDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260520013725',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(RAW_MATERIALS_URN_MAX_LENGTH)
  urnNo: string;

  @ApiProperty({
    description: 'EOI number from product context',
    example: 'GPPMI003014',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(RAW_MATERIALS_EOI_NO_MAX_LENGTH)
  eoiNo?: string;

  @ApiProperty({
    description:
      'Details of the test carried out (textarea). Optional on this endpoint if products/files are saved separately.',
    example: 'Details of hazardous raw materials and handling controls.',
    required: false,
  })
  @IsString()
  @IsOptional()
  details?: string;
}
