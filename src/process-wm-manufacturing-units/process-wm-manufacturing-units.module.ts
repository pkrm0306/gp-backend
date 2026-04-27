import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessWmManufacturingUnit,
  ProcessWmManufacturingUnitSchema,
} from './schemas/process-wm-manufacturing-unit.schema';
import { ProcessWmManufacturingUnitsService } from './process-wm-manufacturing-units.service';
import { ProcessWmManufacturingUnitsController } from './process-wm-manufacturing-units.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProcessWmManufacturingUnit.name,
        schema: ProcessWmManufacturingUnitSchema,
      },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [ProcessWmManufacturingUnitsController],
  providers: [ProcessWmManufacturingUnitsService],
  exports: [ProcessWmManufacturingUnitsService],
})
export class ProcessWmManufacturingUnitsModule {}
