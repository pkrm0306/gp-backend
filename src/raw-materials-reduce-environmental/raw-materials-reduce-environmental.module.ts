import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsReduceEnvironmental,
  RawMaterialsReduceEnvironmentalSchema,
} from './schemas/raw-materials-reduce-environmental.schema';
import { RawMaterialsReduceEnvironmentalService } from './raw-materials-reduce-environmental.service';
import { RawMaterialsReduceEnvironmentalController } from './raw-materials-reduce-environmental.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsReduceEnvironmental.name,
        schema: RawMaterialsReduceEnvironmentalSchema,
      },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsReduceEnvironmentalController],
  providers: [RawMaterialsReduceEnvironmentalService],
  exports: [RawMaterialsReduceEnvironmentalService],
})
export class RawMaterialsReduceEnvironmentalModule {}
