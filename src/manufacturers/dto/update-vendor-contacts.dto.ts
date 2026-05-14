import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

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
