import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Allow,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

function firstString(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      return String(v).trim();
    }
  }
  return undefined;
}

export class CreateUrnSiteVisitDto {
  @ApiProperty({ example: 'URN-20260514165917' })
  @Transform(({ obj, value }) => firstString(value, obj?.urn_no))
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    example: 'Plant A',
    description:
      'Manufacturing plant name for this URN (must match an active plant on the URN). Use GET /api/admin/urn-site-visits/plant-options?urnNo=… for allowed values.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  name: string;

  @ApiProperty({ example: '12 Industrial Ave' })
  @Transform(({ obj, value }) =>
    firstString(value, obj?.address_line1) ?? value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  addressLine1: string;

  @ApiPropertyOptional({ example: '' })
  @Transform(({ obj, value }) =>
    value === undefined ? obj?.address_line2 : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(500)
  addressLine2?: string;

  @ApiProperty({ example: 'Sydney' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  city: string;

  @ApiProperty({ example: 'NSW' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  state: string;

  /** Legacy clients may still send postal code; it is ignored. */
  @Allow()
  postalCode?: unknown;

  @Allow()
  postal_code?: unknown;

  @ApiProperty({ example: 'Australia', description: 'Country display name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  country: string;

  @ApiPropertyOptional({ example: 'Initial audit' })
  @Transform(({ obj, value }) => firstString(value, obj?.audit_type))
  @IsOptional()
  @IsString()
  @MaxLength(200)
  auditType?: string;

  @ApiPropertyOptional({ example: '2026-05-14' })
  @Transform(({ obj, value }) =>
    firstString(value, obj?.audit_conducted_on),
  )
  @IsOptional()
  @IsDateString()
  auditConductedOn?: string;

  @ApiPropertyOptional({ example: 'GreenPro Auditor' })
  @Transform(({ obj, value }) => firstString(value, obj?.conducted_by))
  @IsOptional()
  @IsString()
  @MaxLength(500)
  conductedBy?: string;
}
