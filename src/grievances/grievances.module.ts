import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RbacModule } from '../rbac/rbac.module';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import { AdminGrievancesController } from './admin-grievances.controller';
import { GrievancesService } from './grievances.service';
import {
  GrievanceIdCounter,
  GrievanceIdCounterSchema,
} from './schemas/grievance-id-counter.schema';
import { Grievance, GrievanceSchema } from './schemas/grievance.schema';
import { VendorGrievancesController } from './vendor-grievances.controller';

@Module({
  imports: [
    RbacModule,
    MongooseModule.forFeature([
      { name: Grievance.name, schema: GrievanceSchema },
      { name: GrievanceIdCounter.name, schema: GrievanceIdCounterSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
    ]),
  ],
  controllers: [VendorGrievancesController, AdminGrievancesController],
  providers: [GrievancesService, PermissionsGuard],
  exports: [GrievancesService],
})
export class GrievancesModule {}
