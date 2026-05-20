import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ProductRegistrationController } from './product-registration.controller';
import { ProductsController } from './products.controller';
import { AdminProductsController } from './admin-products.controller';
import { AdminUrnController } from './admin-urn.controller';
import { ProductController } from './product.controller';
import { ProductRegistrationService } from './product-registration.service';
import { EoiNumberService } from './services/eoi-number.service';
import { ProductSoftDeleteService } from './services/product-soft-delete.service';
import { Product, ProductSchema } from './schemas/product.schema';
import {
  ProductPlant,
  ProductPlantSchema,
} from './schemas/product-plant.schema';
import { SequenceHelper } from './helpers/sequence.helper';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { CountriesModule } from '../countries/countries.module';
import { StatesModule } from '../states/states.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { RbacModule } from '../rbac/rbac.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { UrnSiteVisitsModule } from '../urn-site-visits/urn-site-visits.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductPlant.name, schema: ProductPlantSchema },
    ]),
    PassportModule,
    AuthModule,
    ManufacturersModule,
    CountriesModule,
    StatesModule,
    CategoriesModule,
    ActivityLogModule,
    RbacModule,
    UrnSiteVisitsModule,
  ],
  controllers: [
    ProductRegistrationController,
    ProductsController,
    AdminProductsController,
    AdminUrnController,
    ProductController,
  ],
  providers: [
    ProductRegistrationService,
    EoiNumberService,
    ProductSoftDeleteService,
    SequenceHelper,
    PermissionsGuard,
  ],
  exports: [
    ProductRegistrationService,
    EoiNumberService,
    ProductSoftDeleteService,
    SequenceHelper,
  ],
})
export class ProductRegistrationModule {}
