import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateGrievanceDto } from './dto/create-grievance.dto';
import { GrievancesService } from './grievances.service';

@ApiTags('Vendor Grievances')
@Controller('api/vendor/grievances')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorGrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  private requireVendorId(user: {
    vendorId?: string;
    manufacturerId?: string;
  }): string {
    const vendorId = user?.vendorId || user?.manufacturerId;
    if (!vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    return String(vendorId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List grievances for the logged-in vendor',
    description:
      'Returns only grievances belonging to the authenticated vendor (newest first).',
  })
  @ApiResponse({ status: 200, description: 'Grievances retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @CurrentUser()
    user: { vendorId?: string; manufacturerId?: string },
  ) {
    const vendorId = this.requireVendorId(user);
    const data = await this.grievancesService.findAllForVendor(vendorId);
    return {
      message: 'Grievances retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get a single grievance',
    description:
      'Returns a grievance by id. Vendors may only access their own grievances.',
  })
  @ApiParam({ name: 'id', description: 'Grievance MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Grievance retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Grievance not found' })
  async findOne(
    @CurrentUser()
    user: { vendorId?: string; manufacturerId?: string },
    @Param('id') id: string,
  ) {
    const vendorId = this.requireVendorId(user);
    const data = await this.grievancesService.findOneForVendor(id, vendorId);
    return {
      message: 'Grievance retrieved successfully',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Raise a new grievance',
    description:
      'Creates a grievance for the logged-in vendor. Status is always set to Pending. grievanceNo is auto-generated (GRV-000001).',
  })
  @ApiBody({ type: CreateGrievanceDto })
  @ApiResponse({ status: 201, description: 'Grievance created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser()
    user: { vendorId?: string; manufacturerId?: string },
    @Body() dto: CreateGrievanceDto,
  ) {
    const vendorId = this.requireVendorId(user);
    const data = await this.grievancesService.createForVendor(vendorId, dto);
    return {
      message: 'Grievance created successfully',
      data,
    };
  }
}
