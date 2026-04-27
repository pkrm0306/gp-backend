import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductPerformance,
  ProductPerformanceSchema,
} from './schemas/product-performance.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { ProductPerformanceService } from './product-performance.service';
import { ProductPerformanceController } from './product-performance.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductPerformance.name, schema: ProductPerformanceSchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule, // For SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [ProductPerformanceController],
  providers: [ProductPerformanceService],
  exports: [ProductPerformanceService],
})
export class ProductPerformanceModule {}
