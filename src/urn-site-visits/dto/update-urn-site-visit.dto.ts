import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUrnSiteVisitDto {
  @ApiPropertyOptional({
    description:
      'Manufacturing plant name for this URN (single select; must match GET plant-options for the URN).',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  name?: string;

  @ApiPropertyOptional()
  @Transform(({ obj, value }) =>
    value === undefined ? obj?.address_line1 : value,
  )
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  addressLine1?: string;

  @ApiPropertyOptional()
  @Transform(({ obj, value }) =>
    value === undefined ? obj?.address_line2 : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(500)
  addressLine2?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  state?: string;

  @ApiPropertyOptional()
  @Transform(({ obj, value }) =>
    value === undefined ? obj?.postal_code : value,
  )
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  country?: string;

  @ApiPropertyOptional()
  @Transform(({ obj, value }) =>
    value === undefined ? obj?.audit_type : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(200)
  auditType?: string | null;

  @ApiPropertyOptional()
  @Transform(({ obj, value }) =>
    value === undefined ? obj?.audit_conducted_on : value,
  )
  @IsOptional()
  @IsDateString()
  auditConductedOn?: string | null;

  @ApiPropertyOptional()
  @Transform(({ obj, value }) =>
    value === undefined ? obj?.conducted_by : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(500)
  conductedBy?: string | null;
}
