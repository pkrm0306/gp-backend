import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteNewsletterSubscriberDto {
  @ApiProperty({
    description:
      'Subscriber identifier. Accepts MongoDB _id (recommended) OR S.No from list (1-based).',
    examples: ['661157aa2b2d2b2d2b2d2b2d', '1'],
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
