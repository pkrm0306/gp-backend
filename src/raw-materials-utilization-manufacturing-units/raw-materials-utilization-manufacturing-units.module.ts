import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsUtilizationManufacturingUnits,
  RawMaterialsUtilizationManufacturingUnitsSchema,
} from './schemas/raw-materials-utilization-manufacturing-units.schema';
import { RawMaterialsUtilizationManufacturingUnitsService } from './raw-materials-utilization-manufacturing-units.service';
import { RawMaterialsUtilizationManufacturingUnitsController } from './raw-materials-utilization-manufacturing-units.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsUtilizationManufacturingUnits.name,
        schema: RawMaterialsUtilizationManufacturingUnitsSchema,
      },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsUtilizationManufacturingUnitsController],
  providers: [RawMaterialsUtilizationManufacturingUnitsService],
  exports: [RawMaterialsUtilizationManufacturingUnitsService],
})
export class RawMaterialsUtilizationManufacturingUnitsModule {}
