import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

function toTrimmedString(value: unknown): string {
  return String(value ?? '').trim();
}

export class AdminUpdateCertifiedProductPassportDto {
  @ApiPropertyOptional({
    description:
      'Passport content for certified product (optional). Maximum 5000 characters excluding whitespace.',
    example: 'This product uses recycled input materials and low-emission process.',
  })
  @Transform(({ value }) => toTrimmedString(value))
  @IsOptional()
  @IsString()
  passport?: string;
}
