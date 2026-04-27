import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsEliminationOfProhibitedFlameSolventsProducts,
  RawMaterialsEliminationOfProhibitedFlameSolventsProductsSchema,
} from './schemas/raw-materials-elimination-of-prohibited-flame-solvents-products.schema';
import { RawMaterialsEliminationOfProhibitedFlameSolventsProductsService } from './raw-materials-elimination-of-prohibited-flame-solvents-products.service';
import { RawMaterialsEliminationOfProhibitedFlameSolventsProductsController } from './raw-materials-elimination-of-prohibited-flame-solvents-products.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsEliminationOfProhibitedFlameSolventsProducts.name,
        schema: RawMaterialsEliminationOfProhibitedFlameSolventsProductsSchema,
      },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [
    RawMaterialsEliminationOfProhibitedFlameSolventsProductsController,
  ],
  providers: [RawMaterialsEliminationOfProhibitedFlameSolventsProductsService],
  exports: [RawMaterialsEliminationOfProhibitedFlameSolventsProductsService],
})
export class RawMaterialsEliminationOfProhibitedFlameSolventsProductsModule {}
