import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessWasteManagement,
  ProcessWasteManagementSchema,
} from './schemas/process-waste-management.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { ProcessWasteManagementService } from './process-waste-management.service';
import { ProcessWasteManagementController } from './process-waste-management.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProcessWasteManagement.name,
        schema: ProcessWasteManagementSchema,
      },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [ProcessWasteManagementController],
  providers: [ProcessWasteManagementService],
  exports: [ProcessWasteManagementService],
})
export class ProcessWasteManagementModule {}
