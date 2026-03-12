import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessLifeCycleApproach,
  ProcessLifeCycleApproachSchema,
} from './schemas/process-life-cycle-approach.schema';
import {
  AllProductDocument,
  AllProductDocumentSchema,
} from '../product-design/schemas/all-product-document.schema';
import { ProcessLifeCycleApproachService } from './process-life-cycle-approach.service';
import { ProcessLifeCycleApproachController } from './process-life-cycle-approach.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProcessLifeCycleApproach.name, schema: ProcessLifeCycleApproachSchema },
      { name: AllProductDocument.name, schema: AllProductDocumentSchema },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [ProcessLifeCycleApproachController],
  providers: [ProcessLifeCycleApproachService],
  exports: [ProcessLifeCycleApproachService],
})
export class ProcessLifeCycleApproachModule {}
