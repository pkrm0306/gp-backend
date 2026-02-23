import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    private countryModel: Model<CountryDocument>,
  ) {}

  async findAll() {
    return this.countryModel.find().sort({ countryName: 1 }).exec();
  }

  async findById(id: string): Promise<CountryDocument | null> {
    return this.countryModel.findById(id).exec();
  }
}
