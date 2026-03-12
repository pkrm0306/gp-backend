import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateProcessLifeCycleApproachDto {
  @ApiProperty({
    description: 'URN number',
    example: 'URN-20260305124230',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  urnNo: string;

  @ApiProperty({
    description: 'Life cycle implementation details (text)',
    example: 'Implementation details for life cycle approach',
    required: false,
  })
  @IsString()
  @IsOptional()
  lifeCycleImplementationDetails?: string;

  @ApiProperty({
    description: 'Process life cycle approach status (0=Pending, 1=Completed)',
    example: 0,
    required: false,
    enum: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1])
  processLifeCycleApproachStatus?: number;

  @ApiProperty({
    description:
      'Life cycle assessment reports display name (required if uploading lifeCycleAssesmentReportsFile)',
    example: 'Life Cycle Assessment Reports - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  lifeCycleAssesmentReportsFileName?: string;

  @ApiProperty({
    description:
      'Life cycle implementation documents display name (required if uploading lifeCycleImplementationDocumentsFile)',
    example: 'Life Cycle Implementation Documents - March 2026',
    required: false,
  })
  @IsString()
  @IsOptional()
  lifeCycleImplementationDocumentsFileName?: string;
}
