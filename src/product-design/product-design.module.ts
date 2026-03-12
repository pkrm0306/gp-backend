import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductDesign, ProductDesignSchema } from './schemas/product-design.schema';
import { PdMeasure, PdMeasureSchema } from './schemas/pd-measure.schema';
import { AllProductDocument, AllProductDocumentSchema } from './schemas/all-product-document.schema';
import { ProductDesignService } from './product-design.service';
import { ProductDesignController } from './product-design.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductDesign.name, schema: ProductDesignSchema },
      { name: PdMeasure.name, schema: PdMeasureSchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule, // For SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [ProductDesignController],
  providers: [ProductDesignService],
  exports: [ProductDesignService],
})
export class ProductDesignModule {}
