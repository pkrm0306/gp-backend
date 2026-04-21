import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsGreenSupply,
  RawMaterialsGreenSupplySchema,
} from './schemas/raw-materials-green-supply.schema';
import { RawMaterialsGreenSupplyService } from './raw-materials-green-supply.service';
import { RawMaterialsGreenSupplyController } from './raw-materials-green-supply.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawMaterialsGreenSupply.name, schema: RawMaterialsGreenSupplySchema },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsGreenSupplyController],
  providers: [RawMaterialsGreenSupplyService],
  exports: [RawMaterialsGreenSupplyService],
})
export class RawMaterialsGreenSupplyModule {}
