import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class DeleteDocumentParamsDto {
  @ApiProperty({
    description: 'Product document numeric identifier',
    example: 1001,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  documentId: number;
}
