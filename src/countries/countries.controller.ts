import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
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

  @Get('search')
  @ApiOperation({
    summary: 'Search country by name',
    description: 'Searches for countries by name (case-insensitive partial match, like SQL LIKE %term%) and returns matching countries with their IDs',
  })
  @ApiQuery({
    name: 'name',
    required: true,
    type: String,
    description: 'Country name to search for (partial match supported)',
    example: 'India',
  })
  @ApiResponse({
    status: 200,
    description: 'Countries found successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Countries found successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '6998547b14999ba875c7d70c' },
              countryName: { type: 'string', example: 'India' },
              countryCode: { type: 'string', example: 'IN' },
              id: { type: 'number', example: 1 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'No countries found (returns empty array)' })
  async searchByName(@Query('name') name: string) {
    if (!name || name.trim() === '') {
      throw new NotFoundException('Country name is required');
    }

    const countries = await this.countriesService.searchByName(name);
    
    if (countries.length === 0) {
      return {
        message: `No countries found matching "${name}"`,
        data: [],
      };
    }

    return {
      message: `${countries.length} countr${countries.length === 1 ? 'y' : 'ies'} found`,
      data: countries,
    };
  }
}
