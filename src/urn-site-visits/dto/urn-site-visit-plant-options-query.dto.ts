import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

function firstString(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      return String(v).trim();
    }
  }
  return undefined;
}

export class UrnSiteVisitPlantOptionsQueryDto {
  @ApiProperty({ example: 'URN-20260514165917' })
  @Transform(({ obj, value }) => firstString(value, obj?.urn_no))
  @IsString()
  @IsNotEmpty()
  urnNo: string;
}
