import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesController } from './raw-materials-elimination-of-ozone-depleting-global-warming-substances.controller';
import { RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesService } from './raw-materials-elimination-of-ozone-depleting-global-warming-substances.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesController],
  providers: [RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesService],
  exports: [RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesService],
})
export class RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesModule {}

