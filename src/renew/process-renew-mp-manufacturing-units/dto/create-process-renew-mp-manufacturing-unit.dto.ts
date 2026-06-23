import { IntersectionType } from '@nestjs/swagger';
import { CreateProcessMpManufacturingUnitDto } from '../../../process-mp-manufacturing-units/dto/create-process-mp-manufacturing-unit.dto';
import { RenewCycleScopeFields } from '../../dto/renew-cycle-scope-fields.dto';
import { RenewMpManufacturingUnitIdFields } from '../../dto/renew-mp-manufacturing-unit-id-fields.dto';

export class CreateProcessRenewMpManufacturingUnitDto extends IntersectionType(
  CreateProcessMpManufacturingUnitDto,
  RenewCycleScopeFields,
  RenewMpManufacturingUnitIdFields,
) {}
