import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteDocumentQueryDto {
  @ApiProperty({
    description: 'URN number associated with the document',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiPropertyOptional({
    description:
      'Optional section key from the vendor tab (informational only; delete is authorized by document id, URN, and vendor ownership)',
    example: 'raw_materials_recycled_content',
  })
  @IsOptional()
  @IsString()
  sectionKey?: string;
}
