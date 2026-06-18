import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteDocumentParamsDto {
  @ApiProperty({
    description:
      'Product document id (`productDocumentId` number) or MongoDB `_id` (24-char hex)',
    example: '1001',
  })
  @IsString()
  @IsNotEmpty()
  documentId: string;
}
