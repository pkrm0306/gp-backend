import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RawMaterialsUtilizationManufacturingUnitsService } from './raw-materials-utilization-manufacturing-units.service';
import { CreateRawMaterialsUtilizationManufacturingUnitsDto } from './dto/create-raw-materials-utilization-manufacturing-units.dto';

@ApiTags('Raw Materials Utilization Manufacturing Units')
@Controller('raw-materials-utilization-manufacturing-units')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsUtilizationManufacturingUnitsController {
  constructor(
    private readonly service: RawMaterialsUtilizationManufacturingUnitsService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create raw materials utilization manufacturing units record (per URN)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo', 'units'],
      properties: {
        urnNo: { type: 'string', example: 'URN-20260305124230' },
        units: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  unitName: { type: 'string', example: 'Manufacturing Unit A' },
                  year: { type: 'number', example: 2026 },
                  yeardata1: { type: 'number', example: 10 },
                  yeardata2: { type: 'number', example: 20 },
                  yeardata3: { type: 'number', example: 30 },
                },
              },
            },
            {
              type: 'string',
              description: 'JSON stringified units array',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    let units = body.units;
    if (typeof body.units === 'string') {
      try {
        units = JSON.parse(body.units);
      } catch {
        throw new BadRequestException('Invalid units format. Expected JSON array.');
      }
    }
    if (!Array.isArray(units) || units.length === 0) {
      throw new BadRequestException('units must be a non-empty array');
    }

    const dto: CreateRawMaterialsUtilizationManufacturingUnitsDto = {
      urnNo: body.urnNo,
      units,
    };

    const data = await this.service.create(dto, user.vendorId);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary:
      'List raw materials utilization manufacturing units records by URN',
  })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  async listByUrn(@CurrentUser() user: any, @Param('urn_no') urnNo: string) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    if (!urnNo || urnNo.trim() === '') {
      throw new BadRequestException('URN number is required');
    }
    const data = await this.service.listByUrn(urnNo.trim(), user.vendorId);
    return { success: true, data };
  }
}
