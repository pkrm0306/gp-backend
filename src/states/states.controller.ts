import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StatesService } from './states.service';

@ApiTags('States')
@Controller('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all states',
    description:
      'Returns all states from the states collection, sorted by state name ascending. Optionally filter by countryId.',
  })
  @ApiQuery({
    name: 'countryId',
    required: false,
    type: String,
    description: 'Filter states by country ID (MongoDB ObjectId)',
    example: '6998547b14999ba875c7d70c',
  })
  @ApiResponse({ status: 200, description: 'List of states retrieved successfully' })
  async findAll(@Query('countryId') countryId?: string) {
    const states = await this.statesService.findAll(countryId);
    return {
      message: 'States retrieved successfully',
      data: states,
    };
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search state by name',
    description: 'Searches for states by name (case-insensitive partial match, like SQL LIKE %term%) and returns matching states with their IDs. Optionally filter by countryId.',
  })
  @ApiQuery({
    name: 'name',
    required: true,
    type: String,
    description: 'State name to search for (partial match supported)',
    example: 'Maharashtra',
  })
  @ApiQuery({
    name: 'countryId',
    required: false,
    type: String,
    description: 'Optional: Filter states by country ID (MongoDB ObjectId)',
    example: '6998547b14999ba875c7d70c',
  })
  @ApiResponse({
    status: 200,
    description: 'States found successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'States found successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '6996dcda14999ba875c7d646' },
              stateName: { type: 'string', example: 'Maharashtra' },
              stateCode: { type: 'string', example: 'MH' },
              countryId: { type: 'string', example: '6998547b14999ba875c7d70c' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'No states found (returns empty array)' })
  async searchByName(
    @Query('name') name: string,
    @Query('countryId') countryId?: string,
  ) {
    if (!name || name.trim() === '') {
      throw new NotFoundException('State name is required');
    }

    const states = await this.statesService.searchByName(name, countryId);
    
    if (states.length === 0) {
      const message = countryId
        ? `No states found matching "${name}" in the specified country`
        : `No states found matching "${name}"`;
      return {
        message,
        data: [],
      };
    }

    return {
      message: `${states.length} state${states.length === 1 ? '' : 's'} found`,
      data: states,
    };
  }
}
