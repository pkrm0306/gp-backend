import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteTeamMemberDto {
  @ApiProperty({ description: 'Team member document id (from list)' })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
