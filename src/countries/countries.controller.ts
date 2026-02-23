import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CountriesService } from './countries.service';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all countries',
    description: 'Returns all countries from the countries collection, sorted by country name ascending',
  })
  @ApiResponse({ status: 200, description: 'List of countries retrieved successfully' })
  async findAll() {
    const countries = await this.countriesService.findAll();
    return {
      message: 'Countries retrieved successfully',
      data: countries,
    };
  }
}
