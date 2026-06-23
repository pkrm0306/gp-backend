import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

/** Renew-scoped MP unit id (distinct from certification processMpManufacturingUnitId). */
export class RenewMpManufacturingUnitIdFields {
  @ApiProperty({
    description: 'Renew cycle MP manufacturing unit id — updates that row when set',
    required: false,
    example: 15,
  })
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  })
  @IsNumber()
  @IsOptional()
  processRenewMpManufacturingUnitId?: number;
}
