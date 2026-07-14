import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { AccountDeletionStatus } from '../schemas/account-deletion-request.schema';

export class ReviewAccountDeletionRequestDto {
  @ApiProperty({
    enum: [
      AccountDeletionStatus.Approved,
      AccountDeletionStatus.Rejected,
      AccountDeletionStatus.Completed,
    ],
    example: AccountDeletionStatus.Approved,
    description:
      'Approve or Reject a Requested item; mark Completed after Approved to soft-delete the account (block login, hide website products, free email). Does not permanently delete records.',
  })
  @IsIn(
    [
      AccountDeletionStatus.Approved,
      AccountDeletionStatus.Rejected,
      AccountDeletionStatus.Completed,
    ],
    {
      message: 'status must be Approved, Rejected, or Completed',
    },
  )
  status:
    | AccountDeletionStatus.Approved
    | AccountDeletionStatus.Rejected
    | AccountDeletionStatus.Completed;

  @ApiPropertyOptional({
    example: 'Request reviewed. Soft deletion applied on Complete.',
    description: 'Required when rejecting. Optional for approve/complete.',
  })
  @ValidateIf(
    (o: ReviewAccountDeletionRequestDto) =>
      o.status === AccountDeletionStatus.Rejected,
  )
  @IsString()
  @IsNotEmpty({ message: 'adminRemarks are required when rejecting' })
  @IsOptional()
  adminRemarks?: string;
}
