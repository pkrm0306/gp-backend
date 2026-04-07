import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteContactMessageDto {
  @ApiProperty({ description: 'Contact message document id (from contact list)' })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}

