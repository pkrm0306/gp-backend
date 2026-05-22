import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../../product-design/schemas/all-product-document.schema';
import {
  Product,
  ProductSchema,
} from '../../product-registration/schemas/product.schema';
import { RawMaterialsStepGateService } from './raw-materials-step-gate.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  providers: [RawMaterialsStepGateService],
  exports: [RawMaterialsStepGateService],
})
export class RawMaterialsSharedModule {}
