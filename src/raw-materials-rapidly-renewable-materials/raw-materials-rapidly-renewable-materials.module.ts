import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsRapidlyRenewableMaterials,
  RawMaterialsRapidlyRenewableMaterialsSchema,
} from './schemas/raw-materials-rapidly-renewable-materials.schema';
import { RawMaterialsRapidlyRenewableMaterialsService } from './raw-materials-rapidly-renewable-materials.service';
import { RawMaterialsRapidlyRenewableMaterialsController } from './raw-materials-rapidly-renewable-materials.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsRapidlyRenewableMaterials.name,
        schema: RawMaterialsRapidlyRenewableMaterialsSchema,
      },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsRapidlyRenewableMaterialsController],
  providers: [RawMaterialsRapidlyRenewableMaterialsService],
  exports: [RawMaterialsRapidlyRenewableMaterialsService],
})
export class RawMaterialsRapidlyRenewableMaterialsModule {}
