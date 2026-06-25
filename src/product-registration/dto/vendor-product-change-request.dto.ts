import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

function trimString(value: unknown): string {
  return String(value ?? '').trim();
}

export class VendorProductChangeRequestDto {
  @ApiProperty({
    description: 'MongoDB product _id from certified products list',
    example: '66545c2f3d4f04cc8ec2ab11',
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @ApiPropertyOptional({
    description: 'URN number (optional; server falls back to product URN)',
    example: 'URN-20260527122016',
  })
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : trimString(value),
  )
  @IsOptional()
  @IsString()
  urnNo?: string;

  @ApiPropertyOptional({
    description: 'EOI number (optional; server falls back to product EOI)',
    example: 'GPPM1003016',
  })
  @Transform(({ value }) =>
    value === undefined || value === null ? undefined : trimString(value),
  )
  @IsOptional()
  @IsString()
  eoiNo?: string;

  @ApiProperty({
    description: 'Current product name shown in vendor certified list',
    example: 'new product m2',
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  currentName: string;

  @ApiProperty({
    description: 'Requested new product name (required)',
    example: 'new product m2 updated',
    required: true,
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty({ message: 'New Product Name is required.' })
  @MinLength(1, { message: 'New Product Name is required.' })
  @MaxLength(500, {
    message: 'New Product Name must not exceed 500 characters.',
  })
  requestedName: string;

  @ApiProperty({
    description: 'Reason for product name change request (required)',
    example: 'Brand naming correction required after compliance review.',
    required: true,
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty({ message: 'Reason is required.' })
  @MinLength(1, { message: 'Reason is required.' })
  reason: string;
}
