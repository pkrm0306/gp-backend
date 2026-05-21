import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import type { InnovationDocumentTag } from '../utils/innovation-document-tag.util';

export class PatchInnovationDocumentTagDto {
  @ApiProperty({ example: 'URN-20260305124230' })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Numeric id from `process_innovation_documents[].productDocumentId`',
    example: 1001,
  })
  @Type(() => Number)
  @IsInt()
  productDocumentId: number;

  @ApiProperty({ enum: ['tech', 'process', 'social'] })
  @IsString()
  @IsIn(['tech', 'process', 'social'])
  documentTag: InnovationDocumentTag;
}
