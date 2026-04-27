import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StandardsController } from './standards.controller';
import { StandardsService } from './standards.service';
import { Standard, StandardSchema } from './schemas/standard.schema';
import {
  StandardIdCounter,
  StandardIdCounterSchema,
} from './schemas/standard-id-counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Standard.name, schema: StandardSchema },
      { name: StandardIdCounter.name, schema: StandardIdCounterSchema },
    ]),
  ],
  controllers: [StandardsController],
  providers: [StandardsService],
  exports: [StandardsService],
})
export class StandardsModule {}
