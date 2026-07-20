import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import {
  PRODUCTS_UPDATE_ANY,
  PRODUCTS_VIEW_ANY,
} from '../common/constants/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UrnSiteVisitsService } from './urn-site-visits.service';
import { ListUrnSiteVisitsDto } from './dto/list-urn-site-visits.dto';
import { CreateUrnSiteVisitDto } from './dto/create-urn-site-visit.dto';
import { UpdateUrnSiteVisitDto } from './dto/update-urn-site-visit.dto';
import { UrnSiteVisitPlantOptionsQueryDto } from './dto/urn-site-visit-plant-options-query.dto';

@ApiTags('Admin URN Site Visits')
@Controller('api/admin/urn-site-visits')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminUrnSiteVisitsController {
  constructor(private readonly urnSiteVisitsService: UrnSiteVisitsService) {}

  private actorId(user: Record<string, unknown>): string | undefined {
    const id = user?.userId ?? user?.sub ?? user?.id;
    return id !== undefined && id !== null ? String(id) : undefined;
  }

  @Get()
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({ summary: 'List site visits for a URN (admin)' })
  @ApiQuery({ name: 'urnNo', required: true })
  @ApiResponse({ status: 200, description: 'Site visits listed' })
  async list(@Query() query: ListUrnSiteVisitsDto) {
    const result = await this.urnSiteVisitsService.list(query);
    return {
      success: true,
      message: 'Site visits listed successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get('plant-options')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({
    summary: 'Plant name options for site visit form (admin)',
    description:
      'Returns distinct manufacturing **plantName** values for the URN (single-select `name` on create/update).',
  })
  @ApiQuery({ name: 'urnNo', required: true })
  @ApiResponse({ status: 200, description: 'Plant options for dropdown' })
  async plantOptions(@Query() query: UrnSiteVisitPlantOptionsQueryDto) {
    const options = await this.urnSiteVisitsService.listPlantOptionsForUrn(
      query.urnNo,
    );
    return {
      success: true,
      message: 'Plant options retrieved successfully',
      data: options,
      options,
    };
  }

  @Get(':id')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({ summary: 'Get one site visit by id (admin)' })
  @ApiParam({ name: 'id', description: 'Site visit MongoDB id' })
  @ApiQuery({ name: 'urnNo', required: false })
  async getOne(@Param('id') id: string, @Query('urnNo') urnNo?: string) {
    const data = await this.urnSiteVisitsService.getById(id, urnNo);
    return {
      success: true,
      message: 'Site visit fetched successfully',
      data,
    };
  }

  @Post()
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create site visit for a URN (admin)',
    description:
      'Address fields: plant `name`, `addressLine1`, optional `addressLine2`, `city`, `state`, `country`. Postal code is not collected.',
  })
  @ApiBody({ type: CreateUrnSiteVisitDto })
  @ApiResponse({ status: 201, description: 'Site visit created' })
  async create(
    @CurrentUser() user: Record<string, unknown>,
    @Body() dto: CreateUrnSiteVisitDto,
  ) {
    const data = await this.urnSiteVisitsService.create(
      dto,
      this.actorId(user),
    );
    return {
      success: true,
      message: 'Site visit created successfully',
      data,
    };
  }

  @Put(':id')
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @ApiOperation({
    summary: 'Update site visit (admin)',
    description:
      'Updatable address fields exclude postal code (not collected on site visits).',
  })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateUrnSiteVisitDto })
  async update(
    @CurrentUser() user: Record<string, unknown>,
    @Param('id') id: string,
    @Body() body: UpdateUrnSiteVisitDto & Record<string, unknown>,
  ) {
    const data = await this.urnSiteVisitsService.update(
      id,
      body,
      this.actorId(user),
      body,
    );
    return {
      success: true,
      message: 'Site visit updated successfully',
      data,
    };
  }

  @Delete(':id')
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft-delete site visit (admin)' })
  @ApiParam({ name: 'id' })
  async remove(
    @CurrentUser() user: Record<string, unknown>,
    @Param('id') id: string,
  ) {
    await this.urnSiteVisitsService.softDelete(id, this.actorId(user));
    return {
      success: true,
      message: 'Site visit deleted successfully',
      data: { id },
    };
  }
}
