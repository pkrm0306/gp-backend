import { Controller, Get, Query } from '@nestjs/common';
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
}
