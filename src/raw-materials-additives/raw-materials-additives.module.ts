import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsAdditives,
  RawMaterialsAdditivesSchema,
} from './schemas/raw-materials-additives.schema';
import { RawMaterialsAdditivesService } from './raw-materials-additives.service';
import { RawMaterialsAdditivesController } from './raw-materials-additives.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawMaterialsAdditives.name, schema: RawMaterialsAdditivesSchema },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsAdditivesController],
  providers: [RawMaterialsAdditivesService],
  exports: [RawMaterialsAdditivesService],
})
export class RawMaterialsAdditivesModule {}
