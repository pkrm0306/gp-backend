import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { RbacModule } from '../rbac/rbac.module';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { StatesModule } from '../states/states.module';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import {
  Product,
  ProductSchema,
} from '../product-registration/schemas/product.schema';
import {
  ProductPlant,
  ProductPlantSchema,
} from '../product-registration/schemas/product-plant.schema';
import {
  Manufacturer,
  ManufacturerSchema,
} from '../manufacturers/schemas/manufacturer.schema';
import {
  Country,
  CountrySchema,
} from '../countries/schemas/country.schema';
import { CertificateCorrectionController } from './certificate-correction.controller';
import { CertificateCorrectionService } from './certificate-correction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductPlant.name, schema: ProductPlantSchema },
      { name: Manufacturer.name, schema: ManufacturerSchema },
      { name: Country.name, schema: CountrySchema },
    ]),
    PassportModule,
    AuthModule,
    RbacModule,
    StatesModule,
    ProductRegistrationModule,
  ],
  controllers: [CertificateCorrectionController],
  providers: [CertificateCorrectionService, PermissionsGuard],
})
export class CertificateCorrectionModule {}
