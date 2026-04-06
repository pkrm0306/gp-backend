import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteBannerDto {
  @ApiProperty({ description: 'Banner document id (from banner list)' })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
