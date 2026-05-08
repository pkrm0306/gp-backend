import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty()
  @IsMongoId()
  vendorUserId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  roleId?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  roleIds?: string[];
}

