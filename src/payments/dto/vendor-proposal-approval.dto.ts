import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class VendorProposalApprovalDto {
  @ApiProperty({
    description: 'Payment type (registration required for proposal approval)',
    example: 'registration',
    enum: ['registration', 'certification'],
  })
  @IsString()
  @IsIn(['registration', 'certification'])
  paymentType: string;

  @ApiProperty({
    description: '1 = approve, 2 = reject (0 = pending is server-only)',
    example: 1,
    enum: [1, 2],
  })
  @IsInt()
  @IsIn([1, 2])
  vendorProposalApprovalStatus: 1 | 2;

  @ApiPropertyOptional({
    description: 'Optional reason when rejecting (max 500 characters)',
    example: 'Quote does not match agreed scope',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  proposalRejectionRemarks?: string;
}
