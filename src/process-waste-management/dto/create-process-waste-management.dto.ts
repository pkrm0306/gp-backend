import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateProcessWasteManagementDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Waste management implementation details (text)',
    example: 'Implementation details for waste management',
    required: false,
  })
  @IsString()
  @IsOptional()
  wmImplementationDetails?: string;

  @ApiProperty({
    description: 'Process waste management status (0=Pending, 1=Completed)',
    example: 0,
    required: false,
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  processWasteManagementStatus?: number;

  @ApiProperty({
    description:
      'Waste management supporting documents display name (required if uploading wmSupportingDocumentsFile)',
    example: 'Waste Management Supporting Documents - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  wmSupportingDocumentsFileName?: string;
}
