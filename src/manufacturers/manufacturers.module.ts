import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import {
  Manufacturer,
  ManufacturerSchema,
} from './schemas/manufacturer.schema';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: Product.name, schema: ProductSchema },
      { name: VendorUser.name, schema: VendorUserSchema },
    ]),
    VendorUsersModule,
  ],
  controllers: [
    ManufacturersController,
    VendorController,
    AdminManufacturerActionsController,
  ],
  providers: [ManufacturersService],
  exports: [ManufacturersService],
})
export class ManufacturersModule {}
