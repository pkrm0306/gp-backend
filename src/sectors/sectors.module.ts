import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SectorsController } from './sectors.controller';
import { SectorsService } from './sectors.service';
import { Sector, SectorSchema } from './schemas/sector.schema';
import {
  SectorIdCounter,
  SectorIdCounterSchema,
} from './schemas/sector-id-counter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sector.name, schema: SectorSchema },
      { name: SectorIdCounter.name, schema: SectorIdCounterSchema },
    ]),
  ],
  controllers: [SectorsController],
  providers: [SectorsService],
  exports: [SectorsService],
})
export class SectorsModule {}
