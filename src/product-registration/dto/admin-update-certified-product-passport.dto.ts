import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

function toTrimmedString(value: unknown): string {
  return String(value ?? '').trim();
}

export class AdminUpdateCertifiedProductPassportDto {
  @ApiProperty({
    description:
      'Passport content for certified product. Maximum 5000 characters excluding whitespace.',
    example: 'This product uses recycled input materials and low-emission process.',
  })
  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  @IsNotEmpty()
  passport: string;
}
