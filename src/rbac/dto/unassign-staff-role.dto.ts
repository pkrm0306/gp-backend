import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class UnassignStaffRoleDto {
  @ApiProperty()
  @IsMongoId()
  vendorUserId: string;
}

