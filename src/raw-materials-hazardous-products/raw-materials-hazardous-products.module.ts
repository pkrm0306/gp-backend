import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsHazardousProducts,
  RawMaterialsHazardousProductsSchema,
} from './schemas/raw-materials-hazardous-products.schema';
import { AllProductDocument, AllProductDocumentSchema } from '../product-design/schemas/all-product-document.schema';
import { RawMaterialsHazardousProductsService } from './raw-materials-hazardous-products.service';
import { RawMaterialsHazardousProductsController } from './raw-materials-hazardous-products.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawMaterialsHazardousProducts.name, schema: RawMaterialsHazardousProductsSchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsHazardousProductsController],
  providers: [RawMaterialsHazardousProductsService],
  exports: [RawMaterialsHazardousProductsService],
})
export class RawMaterialsHazardousProductsModule {}

