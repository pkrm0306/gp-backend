import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsIn,
  IsOptional,
} from 'class-validator';

export class UpdateUrnStatusDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Update status type (for future use)',
    example: 'urn_status',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  updateStatusType: string;

  @ApiProperty({
    description: 'New URN status to update to (0-11)',
    example: 2,
    required: true,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  })
  @IsNumber()
  @IsIn([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  updateStatusTo: number;

  @ApiProperty({
    description:
      'Optional product status to update along with urnStatus (0=Pending, 1=Submitted, 2=Certified, 3=Rejected, 4=Expired)',
    example: 1,
    required: false,
    enum: [0, 1, 2, 3, 4],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1, 2, 3, 4])
  productStatus?: number;
}
