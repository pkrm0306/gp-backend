import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessProductStewardship,
  ProcessProductStewardshipSchema,
} from './schemas/process-product-stewardship.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import {
  ProcessPsStakeholderEduAwarness,
  ProcessPsStakeholderEduAwarnessSchema,
} from './schemas/process-ps-stakeholder-edu-awarness.schema';
import { ProcessProductStewardshipService } from './process-product-stewardship.service';
import { ProcessProductStewardshipController } from './process-product-stewardship.controller';
import { Product, ProductSchema } from '../product-registration/schemas/product.schema';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProcessProductStewardship.name,
        schema: ProcessProductStewardshipSchema,
      },
      {
        name: ProcessPsStakeholderEduAwarness.name,
        schema: ProcessPsStakeholderEduAwarnessSchema,
      },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [ProcessProductStewardshipController],
  providers: [ProcessProductStewardshipService],
  exports: [ProcessProductStewardshipService],
})
export class ProcessProductStewardshipModule {}
