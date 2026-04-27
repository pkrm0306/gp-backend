import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsEliminationOfProhibitedFlame,
  RawMaterialsEliminationOfProhibitedFlameSchema,
} from './schemas/raw-materials-elimination-of-prohibited-flame.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
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
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
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
