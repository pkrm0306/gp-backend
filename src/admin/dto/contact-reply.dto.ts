import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ContactReplyDto {
  @ApiProperty({
    description: 'Your reply message to the user',
    example: 'Thanks for reaching out. We will get back to you shortly.',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  @Length(1, 4000)
  replyMessage: string;
}

