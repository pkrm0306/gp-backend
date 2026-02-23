import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ProductRegistrationController } from './product-registration.controller';
import { ProductRegistrationService } from './product-registration.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductPlant, ProductPlantSchema } from './schemas/product-plant.schema';
import { SequenceHelper } from './helpers/sequence.helper';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { VendorsModule } from '../vendors/vendors.module';
import { CountriesModule } from '../countries/countries.module';
import { StatesModule } from '../states/states.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductPlant.name, schema: ProductPlantSchema },
    ]),
    PassportModule,
    AuthModule,
    ManufacturersModule,
    VendorsModule,
    CountriesModule,
    StatesModule,
  ],
  controllers: [ProductRegistrationController],
  providers: [ProductRegistrationService, SequenceHelper],
  exports: [ProductRegistrationService],
})
export class ProductRegistrationModule {}
