import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsHazardous,
  RawMaterialsHazardousSchema,
} from './schemas/raw-materials-hazardous.schema';
import { RawMaterialsHazardousService } from './raw-materials-hazardous.service';
import { RawMaterialsHazardousController } from './raw-materials-hazardous.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawMaterialsHazardous.name, schema: RawMaterialsHazardousSchema },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsHazardousController],
  providers: [RawMaterialsHazardousService],
  exports: [RawMaterialsHazardousService],
})
export class RawMaterialsHazardousModule {}
