import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import {
  Manufacturer,
  ManufacturerSchema,
} from './schemas/manufacturer.schema';
import {
  ManufacturerInternalIdCounter,
  ManufacturerInternalIdCounterSchema,
} from './schemas/manufacturer-internal-id-counter.schema';
import { ManufacturerIdGenerationService } from './manufacturer-id-generation.service';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import {
  VendorUser,
  VendorUserSchema,
} from '../vendor-users/schemas/vendor-user.schema';
import { VendorUsersModule } from '../vendor-users/vendor-users.module';
import { AdminManufacturerActionsController } from './manufacturers.admin.controller';
import { VendorController } from './vendor.controller';
import { RbacModule } from '../rbac/rbac.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AuthModule } from '../auth/auth.module';
import { ZohoModule } from '../zoho/zoho.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Manufacturer.name, schema: ManufacturerSchema },
      {
        name: ManufacturerInternalIdCounter.name,
        schema: ManufacturerInternalIdCounterSchema,
      },
      { name: Product.name, schema: ProductSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
    ]),
    VendorUsersModule,
    RbacModule,
    forwardRef(() => AuthModule),
    ZohoModule,
  ],
  controllers: [
    ManufacturersController,
    VendorController,
    AdminManufacturerActionsController,
  ],
  providers: [
    ManufacturersService,
    ManufacturerIdGenerationService,
    PermissionsGuard,
  ],
  exports: [ManufacturersService, ManufacturerIdGenerationService],
})
export class ManufacturersModule {}
