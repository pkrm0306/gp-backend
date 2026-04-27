import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsRecycledContent,
  RawMaterialsRecycledContentSchema,
} from './schemas/raw-materials-recycled-content.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { RawMaterialsRecycledContentService } from './raw-materials-recycled-content.service';
import { RawMaterialsRecycledContentController } from './raw-materials-recycled-content.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawMaterialsRecycledContent.name, schema: RawMaterialsRecycledContentSchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsRecycledContentController],
  providers: [RawMaterialsRecycledContentService],
  exports: [RawMaterialsRecycledContentService],
})
export class RawMaterialsRecycledContentModule {}
