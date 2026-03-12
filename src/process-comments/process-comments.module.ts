import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProcessComments,
  ProcessCommentsSchema,
} from './schemas/process-comments.schema';
import { ProcessCommentsService } from './process-comments.service';
import { ProcessCommentsController } from './process-comments.controller';
import { ProductRegistrationModule } from '../product-registration/product-registration.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProcessComments.name, schema: ProcessCommentsSchema },
    ]),
    ProductRegistrationModule, // for SequenceHelper
    PassportModule,
    AuthModule,
  ],
  controllers: [ProcessCommentsController],
  providers: [ProcessCommentsService],
  exports: [ProcessCommentsService],
})
export class ProcessCommentsModule {}
