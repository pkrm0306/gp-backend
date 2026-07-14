import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Equals,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ACCOUNT_DELETION_REASONS } from '../schemas/account-deletion-request.schema';

export class CreateAccountDeletionRequestDto {
  @ApiProperty({
    enum: ACCOUNT_DELETION_REASONS,
    example: 'No longer using the platform',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([...ACCOUNT_DELETION_REASONS], {
    message: 'reason must be a valid deletion reason',
  })
  reason: string;

  @ApiPropertyOptional({
    example: 'Optional additional context for the deletion request.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description:
      'Must be true. Confirms the vendor understands this is a deletion request.',
    example: true,
  })
  @IsBoolean()
  @Equals(true, {
    message: 'You must confirm before submitting an account deletion request',
  })
  confirmed: boolean;
}
