import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import {
  PaymentDetails,
  PaymentDetailsSchema,
} from '../payments/schemas/payment-details.schema';
import {
  VendorUser,
  VendorUserSchema,
} from '../vendor-users/schemas/vendor-user.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import {
  ActivityLog,
  ActivityLogSchema,
} from '../activity-log/schemas/activity-log.schema';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { VendorDashboardOverviewService } from './vendor-dashboard-overview.service';
import { VendorDashboardSustainabilityService } from './vendor-dashboard-sustainability.service';
import {
  ProcessMpManufacturingUnit,
  ProcessMpManufacturingUnitSchema,
} from '../process-mp-manufacturing-units/schemas/process-mp-manufacturing-unit.schema';
import {
  RawMaterialsRecycledContent,
  RawMaterialsRecycledContentSchema,
} from '../raw-materials-recycled-content/schemas/raw-materials-recycled-content.schema';
import {
  RawMaterialsRecovery,
  RawMaterialsRecoverySchema,
} from '../raw-materials-recovery/schemas/raw-materials-recovery.schema';
import {
  RawMaterialsRapidlyRenewableMaterials,
  RawMaterialsRapidlyRenewableMaterialsSchema,
} from '../raw-materials-rapidly-renewable-materials/schemas/raw-materials-rapidly-renewable-materials.schema';
import {
  RawMaterialsUtilizationRmc,
  RawMaterialsUtilizationRmcSchema,
} from '../raw-materials-utilization-rmc/schemas/raw-materials-utilization-rmc.schema';

@Module({
  imports: [
    ManufacturersModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: PaymentDetails.name, schema: PaymentDetailsSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
      { name: Event.name, schema: EventSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: ActivityLog.name, schema: ActivityLogSchema },
      { name: ProcessMpManufacturingUnit.name, schema: ProcessMpManufacturingUnitSchema },
      { name: RawMaterialsRecycledContent.name, schema: RawMaterialsRecycledContentSchema },
      { name: RawMaterialsRecovery.name, schema: RawMaterialsRecoverySchema },
      {
        name: RawMaterialsRapidlyRenewableMaterials.name,
        schema: RawMaterialsRapidlyRenewableMaterialsSchema,
      },
      { name: RawMaterialsUtilizationRmc.name, schema: RawMaterialsUtilizationRmcSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    VendorDashboardOverviewService,
    VendorDashboardSustainabilityService,
  ],
  exports: [
    DashboardService,
    VendorDashboardOverviewService,
    VendorDashboardSustainabilityService,
  ],
})
export class DashboardModule {}
