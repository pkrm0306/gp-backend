import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessManufacturing,
  ProcessManufacturingSchema,
} from './schemas/process-manufacturing.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { ProcessManufacturingService } from './process-manufacturing.service';
import { ProcessManufacturingController } from './process-manufacturing.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProcessManufacturing.name, schema: ProcessManufacturingSchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [ProcessManufacturingController],
  providers: [ProcessManufacturingService],
  exports: [ProcessManufacturingService],
})
export class ProcessManufacturingModule {}
