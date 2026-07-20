import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import { RbacModule } from '../rbac/rbac.module';
import {
  VendorUser,
  VendorUserSchema,
} from '../vendor-users/schemas/vendor-user.schema';
import { AdminSpocAllocationController } from './controller/admin-spoc-allocation.controller';
import { SpocAllocationEmailService } from './email/spoc-allocation-email.service';
import {
  SpocAllocationHistory,
  SpocAllocationHistorySchema,
} from './models/spoc-allocation-history.model';
import {
  SpocAllocation,
  SpocAllocationSchema,
} from './models/spoc-allocation.model';
import { SpocAllocationRepository } from './repository/spoc-allocation.repository';
import { SpocAllocationService } from './service/spoc-allocation.service';

/**
 * Isolated SPOC allocation module.
 * Layered layout: controller / service / repository / validation / dto / email / models / routes.
 * Does not modify Product schema, Product APIs, or certification workflow.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpocAllocation.name, schema: SpocAllocationSchema },
      { name: SpocAllocationHistory.name, schema: SpocAllocationHistorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
    ]),
    RbacModule,
    AuthModule,
  ],
  controllers: [AdminSpocAllocationController],
  providers: [
    SpocAllocationRepository,
    SpocAllocationEmailService,
    SpocAllocationService,
    PermissionsGuard,
  ],
  exports: [SpocAllocationService, SpocAllocationRepository, MongooseModule],
})
export class SpocAllocationModule {}
