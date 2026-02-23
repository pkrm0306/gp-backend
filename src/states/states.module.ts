import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatesController } from './states.controller';
import { StatesService } from './states.service';
import { State, StateSchema } from './schemas/state.schema';
import { CountriesModule } from '../countries/countries.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: State.name, schema: StateSchema }]),
    CountriesModule,
  ],
  controllers: [StatesController],
  providers: [StatesService],
  exports: [StatesService],
})
export class StatesModule {}
