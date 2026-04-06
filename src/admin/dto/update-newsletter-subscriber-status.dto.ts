import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateNewsletterSubscriberStatusDto {
  @ApiProperty({
    description:
      'Subscriber identifier. Accepts MongoDB _id (recommended) OR S.No from list (1-based).',
    examples: ['661157aa2b2d2b2d2b2d2b2d', '1'],
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiPropertyOptional({
    description:
      'Desired status. If omitted, backend toggles current status. Allowed: "active" | "inactive" | "1" | "0".',
    examples: ['active', 'inactive', '1', '0'],
  })
  @IsOptional()
  @IsString()
  status?: string;
}

