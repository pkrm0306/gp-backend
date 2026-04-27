import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import {
  ACCEPTED_DOCUMENT_SECTION_KEYS,
  DocumentSectionKey,
} from '../../common/constants/document-section-key.constants';

export class DeleteDocumentQueryDto {
  @ApiProperty({
    description: 'URN number associated with the document',
    example: 'URN-20260305124230',
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    enum: ACCEPTED_DOCUMENT_SECTION_KEYS,
    description: 'Section key/tab where the document belongs',
    example: DocumentSectionKey.RAW_MATERIALS_RECYCLED_CONTENT,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(ACCEPTED_DOCUMENT_SECTION_KEYS)
  sectionKey: string;
}
