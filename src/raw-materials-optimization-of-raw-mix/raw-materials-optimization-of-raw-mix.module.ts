import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsOptimizationOfRawMix,
  RawMaterialsOptimizationOfRawMixSchema,
} from './schemas/raw-materials-optimization-of-raw-mix.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { RawMaterialsOptimizationOfRawMixService } from './raw-materials-optimization-of-raw-mix.service';
import { RawMaterialsOptimizationOfRawMixController } from './raw-materials-optimization-of-raw-mix.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsOptimizationOfRawMix.name,
        schema: RawMaterialsOptimizationOfRawMixSchema,
      },
      {
        name: AllProductDocument.name,
        schema: AllProductDocumentSchema,
      },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsOptimizationOfRawMixController],
  providers: [RawMaterialsOptimizationOfRawMixService],
  exports: [RawMaterialsOptimizationOfRawMixService],
})
export class RawMaterialsOptimizationOfRawMixModule {}
