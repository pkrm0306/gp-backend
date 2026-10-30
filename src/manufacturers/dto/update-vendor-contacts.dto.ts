import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

function resolveContactStatus(value: unknown): 0 | 1 | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value ? 1 : 0;
  const raw = String(value).trim().toLowerCase();
  if (raw === '1' || raw === 'active' || raw === 'true') return 1;
  if (raw === '0' || raw === 'inactive' || raw === 'false') return 0;
  const n = Number(raw);
  if (n === 1) return 1;
  if (n === 0) return 0;
  return undefined;
}

export class VendorContactFieldsDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(320)
  email_id: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  phone_number: string;

  @ApiProperty({ example: 'Head of Engineering' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  designation: string;

  /**
   * Portal access for this contact person.
   * **1 / active** (default) = can log in; **0 / inactive** = portal access restricted.
   */
  @ApiPropertyOptional({
    enum: [0, 1, 'active', 'inactive', true, false],
    default: 1,
    description:
      '1/active (default) enables vendor portal login; 0/inactive deactivates portal access for this contact.',
  })
  @IsOptional()
  @Transform(({ value }) => {
    const resolved = resolveContactStatus(value);
    return resolved === undefined ? 1 : resolved;
  })
  @IsIn([0, 1])
  status?: 0 | 1;
}

export class UpdateVendorContactsDto {
  @ApiProperty({ type: VendorContactFieldsDto })
  @ValidateNested()
  @Type(() => VendorContactFieldsDto)
  technicalContact: VendorContactFieldsDto;

  @ApiProperty({ type: VendorContactFieldsDto })
  @ValidateNested()
  @Type(() => VendorContactFieldsDto)
  marketingContact: VendorContactFieldsDto;
}
