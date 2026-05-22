import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../../product-design/schemas/all-product-document.schema';
import { RawMaterialsStepGateService } from './raw-materials-step-gate.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
  ],
  providers: [RawMaterialsStepGateService],
  exports: [RawMaterialsStepGateService],
})
export class RawMaterialsSharedModule {}
