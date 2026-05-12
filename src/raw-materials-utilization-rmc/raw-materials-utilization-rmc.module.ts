import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsUtilizationRmc,
  RawMaterialsUtilizationRmcSchema,
} from './schemas/raw-materials-utilization-rmc.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { Product, ProductSchema } from '../product-registration/schemas/product.schema';
import { RawMaterialsUtilizationRmcService } from './raw-materials-utilization-rmc.service';
import { RawMaterialsUtilizationRmcController } from './raw-materials-utilization-rmc.controller';
import { RawMaterialsStep15Controller } from './raw-materials-step15.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsUtilizationRmc.name,
        schema: RawMaterialsUtilizationRmcSchema,
      },
      {
        name: AllProductDocument.name,
        schema: AllProductDocumentSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsUtilizationRmcController, RawMaterialsStep15Controller],
  providers: [RawMaterialsUtilizationRmcService],
  exports: [RawMaterialsUtilizationRmcService],
})
export class RawMaterialsUtilizationRmcModule {}
