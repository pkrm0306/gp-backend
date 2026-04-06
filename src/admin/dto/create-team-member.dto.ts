import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeamMemberDto {
  @ApiProperty({ description: 'Team member name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, description: 'Team member designation' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({ description: 'Team member email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Team member mobile number' })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({ required: false, description: 'Facebook profile URL' })
  @IsOptional()
  @IsString()
  facebookUrl?: string;

  @ApiProperty({ required: false, description: 'Twitter profile URL' })
  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @ApiProperty({ required: false, description: 'LinkedIn profile URL' })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;
}

