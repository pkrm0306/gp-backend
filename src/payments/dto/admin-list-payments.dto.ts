import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ListPaymentsDto } from './list-payments.dto';

function trimOptional(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  return s === '' ? undefined : s;
}

/** Admin payment history — same filters as vendor list plus optional manufacturer scope. */
export class AdminListPaymentsDto extends ListPaymentsDto {
  @ApiPropertyOptional({
    description:
      'Filter to one manufacturer / vendor organization (MongoDB _id). Omit to list all vendors.',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @Transform(({ value }) => trimOptional(value))
  @IsString()
  manufacturerId?: string;
}
