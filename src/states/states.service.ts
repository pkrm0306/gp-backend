import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { State, StateDocument } from './schemas/state.schema';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class StatesService {
  constructor(
    @InjectModel(State.name)
    private stateModel: Model<StateDocument>,
    private countriesService: CountriesService,
  ) {}

  async findAll(countryId?: string) {
    const query: any = {};

    if (countryId) {
      // Validate country exists
      const country = await this.countriesService.findById(countryId);
      if (!country) {
        throw new NotFoundException(`Country with ID ${countryId} not found`);
      }

      // Build query to match state with country using multiple methods
      const $or: any[] = [];

      // Method 1: Check countryId (ObjectId)
      $or.push({ countryId: new Types.ObjectId(countryId) });

      // Method 2: Check country_id (integer) if country has id field
      if ((country as any).id) {
        $or.push({ country_id: (country as any).id });
      }

      // Method 3: Check country_code
      const countryCode = (country as any).country_code || country.countryCode;
      if (countryCode) {
        $or.push({ country_code: countryCode });
      }

      // If we have any conditions, use them
      if ($or.length > 0) {
        query.$or = $or;
      } else {
        // If no matching method found, return empty result
        return [];
      }
    }

    return this.stateModel.find(query).sort({ stateName: 1 }).exec();
  }

  async findById(id: string) {
    return this.stateModel.findById(id).exec();
  }
}
