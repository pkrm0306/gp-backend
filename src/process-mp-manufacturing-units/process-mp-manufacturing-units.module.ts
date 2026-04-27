import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessMpManufacturingUnit,
  ProcessMpManufacturingUnitSchema,
} from './schemas/process-mp-manufacturing-unit.schema';
import { ProcessMpManufacturingUnitsService } from './process-mp-manufacturing-units.service';
import { ProcessMpManufacturingUnitsController } from './process-mp-manufacturing-units.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProcessMpManufacturingUnit.name,
        schema: ProcessMpManufacturingUnitSchema,
      },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [ProcessMpManufacturingUnitsController],
  providers: [ProcessMpManufacturingUnitsService],
  exports: [ProcessMpManufacturingUnitsService],
})
export class ProcessMpManufacturingUnitsModule {}
