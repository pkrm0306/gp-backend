import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ description: 'Partner name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Partner email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Partner phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Partner password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
