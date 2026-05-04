import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty()
  @IsMongoId()
  vendorUserId: string;

  @ApiProperty()
  @IsMongoId()
  roleId: string;
}

