import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessMpManufacturingUnit,
  ProcessMpManufacturingUnitSchema,
} from './schemas/process-mp-manufacturing-unit.schema';
import { ProcessMpManufacturingUnitsService } from './process-mp-manufacturing-units.service';
import { ProcessMpManufacturingUnitsController } from './process-mp-manufacturing-units.controller';
import {
  AdminProcessMpManufacturingUnitsController,
  ApiProcessMpManufacturingUnitsController,
} from './admin-process-mp-manufacturing-units.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProcessMpManufacturingUnit.name,
        schema: ProcessMpManufacturingUnitSchema,
      },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
    RbacModule,
  ],
  controllers: [
    ProcessMpManufacturingUnitsController,
    AdminProcessMpManufacturingUnitsController,
    ApiProcessMpManufacturingUnitsController,
  ],
  providers: [ProcessMpManufacturingUnitsService, PermissionsGuard],
  exports: [ProcessMpManufacturingUnitsService],
})
export class ProcessMpManufacturingUnitsModule {}
