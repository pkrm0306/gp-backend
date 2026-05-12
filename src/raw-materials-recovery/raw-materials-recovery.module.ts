import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsRecovery,
  RawMaterialsRecoverySchema,
} from './schemas/raw-materials-recovery.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { RawMaterialsRecoveryService } from './raw-materials-recovery.service';
import { RawMaterialsRecoveryController } from './raw-materials-recovery.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawMaterialsRecovery.name, schema: RawMaterialsRecoverySchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsRecoveryController],
  providers: [RawMaterialsRecoveryService],
  exports: [RawMaterialsRecoveryService],
})
export class RawMaterialsRecoveryModule {}
