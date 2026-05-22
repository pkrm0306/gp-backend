import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsUtilization,
  RawMaterialsUtilizationSchema,
} from './schemas/raw-materials-utilization.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { RawMaterialsUtilizationService } from './raw-materials-utilization.service';
import { RawMaterialsUtilizationController } from './raw-materials-utilization.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { RawMaterialsUtilizationManufacturingUnitsModule } from '../raw-materials-utilization-manufacturing-units/raw-materials-utilization-manufacturing-units.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawMaterialsUtilization.name, schema: RawMaterialsUtilizationSchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
    forwardRef(() => RawMaterialsUtilizationManufacturingUnitsModule),
  ],
  controllers: [RawMaterialsUtilizationController],
  providers: [RawMaterialsUtilizationService],
  exports: [RawMaterialsUtilizationService],
})
export class RawMaterialsUtilizationModule {}
