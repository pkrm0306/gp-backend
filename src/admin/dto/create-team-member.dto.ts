import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TEAM_MEMBER_TEAMS, TeamMemberTeam } from '../../vendor-users/schemas/vendor-user.schema';

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
    description: 'Team group',
    enum: TEAM_MEMBER_TEAMS,
    example: 'technical',
  })
  @Transform(({ value }) =>
    value === undefined || value === null
      ? value
      : String(value).trim().toLowerCase(),
  )
  @IsString()
  @IsIn(TEAM_MEMBER_TEAMS)
  team: TeamMemberTeam;
}
