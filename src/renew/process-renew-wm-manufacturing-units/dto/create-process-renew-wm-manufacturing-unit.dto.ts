import { IntersectionType } from '@nestjs/swagger';
import { CreateProcessWmManufacturingUnitDto } from '../../../process-wm-manufacturing-units/dto/create-process-wm-manufacturing-unit.dto';
import { RenewCycleScopeFields } from '../../dto/renew-cycle-scope-fields.dto';

export class CreateProcessRenewWmManufacturingUnitDto extends IntersectionType(
  CreateProcessWmManufacturingUnitDto,
  RenewCycleScopeFields,
) {}
