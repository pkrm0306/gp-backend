import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

/** Body for POST /activity-log — same fields as internal `ActivityLogService.logActivity`. */
export class CreateActivityLogDto {
  @ApiProperty({ description: 'Vendor MongoDB ObjectId' })
  @IsMongoId()
  vendor_id: string;

  @ApiProperty({ description: 'Manufacturer MongoDB ObjectId' })
  @IsMongoId()
  manufacturer_id: string;

  @ApiProperty({ example: 'URN-20240302120000' })
  @IsString()
  @IsNotEmpty()
  urn_no: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  activities_id: number;

  @ApiProperty({ example: 'Registration Payment' })
  @IsString()
  @IsNotEmpty()
  activity: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  activity_status: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sub_activities_id?: number;

  @ApiProperty({ example: 'Vendor' })
  @IsString()
  @IsNotEmpty()
  responsibility: string;

  @ApiPropertyOptional({ example: 'Admin' })
  @IsOptional()
  @IsString()
  next_responsibility?: string;

  /** Matches DB field name (typo preserved). */
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  next_acitivities_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  next_activity?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  status?: number;
}
