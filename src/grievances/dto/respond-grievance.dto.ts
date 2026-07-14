import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { GrievanceStatus } from '../schemas/grievance.schema';

export class RespondGrievanceDto {
  @ApiPropertyOptional({
    example: 'We have reviewed your request and taken appropriate action.',
    description:
      'Required for the first response. Optional when closing an already responded grievance.',
  })
  @ValidateIf(
    (o: RespondGrievanceDto) => o.status === GrievanceStatus.Responded,
  )
  @IsString()
  @IsNotEmpty({ message: 'adminResponse is required' })
  @IsOptional()
  adminResponse?: string;

  @ApiProperty({
    enum: [GrievanceStatus.Responded, GrievanceStatus.Closed],
    example: GrievanceStatus.Responded,
    description: 'Set to Responded or Closed when submitting a response',
  })
  @IsIn([GrievanceStatus.Responded, GrievanceStatus.Closed], {
    message: 'status must be Responded or Closed',
  })
  status: GrievanceStatus.Responded | GrievanceStatus.Closed;
}
