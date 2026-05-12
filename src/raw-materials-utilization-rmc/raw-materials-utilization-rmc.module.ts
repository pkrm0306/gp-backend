import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsUtilizationRmc,
  RawMaterialsUtilizationRmcSchema,
} from './schemas/raw-materials-utilization-rmc.schema';
import { RawMaterialsUtilizationRmcService } from './raw-materials-utilization-rmc.service';
import { RawMaterialsUtilizationRmcController } from './raw-materials-utilization-rmc.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsUtilizationRmc.name,
        schema: RawMaterialsUtilizationRmcSchema,
      },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsUtilizationRmcController],
  providers: [RawMaterialsUtilizationRmcService],
  exports: [RawMaterialsUtilizationRmcService],
})
export class RawMaterialsUtilizationRmcModule {}
