import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RawMaterialsEliminationOfFormaldehyde,
  RawMaterialsEliminationOfFormaldehydeSchema,
} from './schemas/raw-materials-elimination-of-formaldehyde.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { RawMaterialsEliminationOfFormaldehydeService } from './raw-materials-elimination-of-formaldehyde.service';
import { RawMaterialsEliminationOfFormaldehydeController } from './raw-materials-elimination-of-formaldehyde.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawMaterialsEliminationOfFormaldehyde.name,
        schema: RawMaterialsEliminationOfFormaldehydeSchema,
      },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule,
    PassportModule,
    AuthModule,
  ],
  controllers: [RawMaterialsEliminationOfFormaldehydeController],
  providers: [RawMaterialsEliminationOfFormaldehydeService],
  exports: [RawMaterialsEliminationOfFormaldehydeService],
})
export class RawMaterialsEliminationOfFormaldehydeModule {}
