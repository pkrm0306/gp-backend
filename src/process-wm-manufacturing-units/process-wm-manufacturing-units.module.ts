import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessWmManufacturingUnit,
  ProcessWmManufacturingUnitSchema,
} from './schemas/process-wm-manufacturing-unit.schema';
import { ProcessWmManufacturingUnitsService } from './process-wm-manufacturing-units.service';
import { ProcessWmManufacturingUnitsController } from './process-wm-manufacturing-units.controller';
import {
  AdminProcessWmManufacturingUnitsController,
  ApiProcessWmManufacturingUnitsController,
} from './admin-process-wm-manufacturing-units.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProcessWmManufacturingUnit.name,
        schema: ProcessWmManufacturingUnitSchema,
      },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
    RbacModule,
  ],
  controllers: [
    ProcessWmManufacturingUnitsController,
    AdminProcessWmManufacturingUnitsController,
    ApiProcessWmManufacturingUnitsController,
  ],
  providers: [ProcessWmManufacturingUnitsService, PermissionsGuard],
  exports: [ProcessWmManufacturingUnitsService],
})
export class ProcessWmManufacturingUnitsModule {}
