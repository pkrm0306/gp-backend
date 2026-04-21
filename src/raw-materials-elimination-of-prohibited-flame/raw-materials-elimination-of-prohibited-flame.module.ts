import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsEliminationOfProhibitedFlame,
  RawMaterialsEliminationOfProhibitedFlameSchema,
} from './schemas/raw-materials-elimination-of-prohibited-flame.schema';
import { RawMaterialsEliminationOfProhibitedFlameService } from './raw-materials-elimination-of-prohibited-flame.service';
import { RawMaterialsEliminationOfProhibitedFlameController } from './raw-materials-elimination-of-prohibited-flame.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsEliminationOfProhibitedFlame.name,
        schema: RawMaterialsEliminationOfProhibitedFlameSchema,
      },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsEliminationOfProhibitedFlameController],
  providers: [RawMaterialsEliminationOfProhibitedFlameService],
  exports: [RawMaterialsEliminationOfProhibitedFlameService],
})
export class RawMaterialsEliminationOfProhibitedFlameModule {}
