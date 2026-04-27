import { ApiProperty } from '@nestjs/swagger';

export class NewsletterRecordDto {
  @ApiProperty({ example: 1, description: 'S.No (1-based index in list)' })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({
    example: 'Newsletter',
    description: 'Human-readable subscription type(s)',
  })
  subscribedFor: string;

  @ApiProperty({
    example: '2026-04-06',
    description: 'Date formatted as YYYY-MM-DD',
  })
  createdAt: string;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';
}
