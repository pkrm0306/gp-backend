import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional({
    description:
      'Optional refresh token to invalidate during logout for full session signout.',
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

