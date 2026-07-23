import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CertificateCorrectionPlantDto {
  @Type(() => Number)
  @IsNumber()
  product_plant_id: number;

  @IsMongoId()
  state: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  city: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  additional_plant_info?: string;
}

export class UpdateCertificateCorrectionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  eoi: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  neweoi?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  product: string;

  @IsMongoId()
  manufacturer: string;

  @IsString()
  @IsNotEmpty()
  valid_date: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CertificateCorrectionPlantDto)
  plants: CertificateCorrectionPlantDto[];
}
