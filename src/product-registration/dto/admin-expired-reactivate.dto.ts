import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AdminExpiredReactivateProductDto {
  @ApiProperty({ example: 'URN-20260428123027' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  urnNo: string;

  @ApiProperty({
    description: 'MongoDB _id or numeric productId from admin list',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  productId: string;

  @ApiPropertyOptional({ example: 'GPPMI003026' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  eoiNo?: string;
}

export class AdminExpiredReactivateUrnDto {
  @ApiProperty({ example: 'URN-20260428123027' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  urnNo: string;
}
