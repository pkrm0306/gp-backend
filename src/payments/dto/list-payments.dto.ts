import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class ListPaymentsDto {
  @ApiProperty({
    description: 'Page number (default: 1)',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page (default: 10)',
    example: 10,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Global search term (searches in urn_no, payment_reference_no)',
    example: 'URN-20260303142815',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by payment status (0=Created, 1=Pending, 2=Completed, 3=Cancelled)',
    example: 0,
    required: false,
    enum: [0, 1, 2, 3],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1, 2, 3])
  status?: number;

  @ApiProperty({
    description: 'Filter by payment type',
    example: 'registration',
    required: false,
    enum: ['registration', 'certification', 'renew'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['registration', 'certification', 'renew'])
  paymentType?: string;

  @ApiProperty({
    description: 'Sort order (default: desc)',
    example: 'desc',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort?: string = 'desc';
}
