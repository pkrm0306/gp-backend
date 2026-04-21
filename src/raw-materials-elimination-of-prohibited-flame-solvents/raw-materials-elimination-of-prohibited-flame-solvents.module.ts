import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsEliminationOfProhibitedFlameSolvents,
  RawMaterialsEliminationOfProhibitedFlameSolventsSchema,
} from './schemas/raw-materials-elimination-of-prohibited-flame-solvents.schema';
import { RawMaterialsEliminationOfProhibitedFlameSolventsService } from './raw-materials-elimination-of-prohibited-flame-solvents.service';
import { RawMaterialsEliminationOfProhibitedFlameSolventsController } from './raw-materials-elimination-of-prohibited-flame-solvents.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsEliminationOfProhibitedFlameSolvents.name,
        schema: RawMaterialsEliminationOfProhibitedFlameSolventsSchema,
      },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsEliminationOfProhibitedFlameSolventsController],
  providers: [RawMaterialsEliminationOfProhibitedFlameSolventsService],
  exports: [RawMaterialsEliminationOfProhibitedFlameSolventsService],
})
export class RawMaterialsEliminationOfProhibitedFlameSolventsModule {}
