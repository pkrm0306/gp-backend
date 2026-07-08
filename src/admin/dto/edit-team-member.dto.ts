import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  BUSINESS_VERTICALS,
  BusinessVertical,
} from '../../vendor-users/schemas/vendor-user.schema';

export class EditTeamMemberDto {
  @ApiProperty({ description: 'Team member document id' })
  @IsMongoId()
  @IsNotEmpty()
  id: string;

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

  @ApiProperty({
    required: false,
    description:
      'Optional RBAC role id. If provided, portal access is enabled and credentials email is sent only on first assignment.',
  })
  @IsOptional()
  @IsMongoId()
  roleId?: string;

  @ApiProperty({
    required: false,
    description: 'Display order for list/website ordering',
    minimum: 1,
    example: 1,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    if (!Number.isFinite(n) || n < 1) return undefined;
    return n;
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  displayOrder?: number;

  @ApiProperty({
    description: 'Business vertical',
    enum: BUSINESS_VERTICALS,
    example: 'building products',
  })
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : String(value).trim().toLowerCase(),
  )
  @IsString()
  @IsIn(BUSINESS_VERTICALS)
  businessVertical: BusinessVertical;

  @ApiProperty({
    required: false,
    description: 'When false, team member is hidden on the public website.',
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || String(value).trim() === '') {
      return undefined;
    }
    const v = String(value).trim().toLowerCase();
    if (v === '1' || v === 'true' || v === 'yes' || v === 'on') return true;
    if (v === '0' || v === 'false' || v === 'no' || v === 'off') return false;
    return undefined;
  })
  @IsOptional()
  @IsBoolean()
  showOnWebsite?: boolean;
}
