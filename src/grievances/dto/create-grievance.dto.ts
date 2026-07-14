import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGrievanceDto {
  @ApiProperty({ example: 'Data access request' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'Unauthorized data processing request' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: 'Details of the grievance under DPDP Act.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    example: 'uploads/grievances/evidence.pdf',
    description: 'Optional attachment path or URL',
  })
  @IsOptional()
  @IsString()
  attachment?: string;
}
