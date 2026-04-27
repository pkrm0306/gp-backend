import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsRegionalMaterials,
  RawMaterialsRegionalMaterialsSchema,
} from './schemas/raw-materials-regional-materials.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { RawMaterialsRegionalMaterialsService } from './raw-materials-regional-materials.service';
import { RawMaterialsRegionalMaterialsController } from './raw-materials-regional-materials.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsRegionalMaterials.name,
        schema: RawMaterialsRegionalMaterialsSchema,
      },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsRegionalMaterialsController],
  providers: [RawMaterialsRegionalMaterialsService],
  exports: [RawMaterialsRegionalMaterialsService],
})
export class RawMaterialsRegionalMaterialsModule {}
