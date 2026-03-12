import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessInnovation,
  ProcessInnovationSchema,
} from './schemas/process-innovation.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { ProcessInnovationService } from './process-innovation.service';
import { ProcessInnovationController } from './process-innovation.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProcessInnovation.name, schema: ProcessInnovationSchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [ProcessInnovationController],
  providers: [ProcessInnovationService],
  exports: [ProcessInnovationService],
})
export class ProcessInnovationModule {}
