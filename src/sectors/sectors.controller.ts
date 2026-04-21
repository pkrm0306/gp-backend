import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { SectorsService } from './sectors.service';
import { ListSectorsQueryDto } from './dto/list-sectors-query.dto';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { UpdateSectorStatusDto } from './dto/update-sector-status.dto';

@ApiTags('Sectors')
@Controller('api/sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Get()
  @ApiOperation({
    summary: 'List sectors (paginated)',
    description:
      'Pagination, search on name (case-insensitive), filter by status, sort by id or name. Example: ?page=1&limit=10&search=IT&status=1&sortBy=id&order=desc',
  })
  @ApiResponse({ status: 200, description: 'Paginated list with total, page, limit' })
  async findAll(@Query() query: ListSectorsQueryDto) {
    return this.sectorsService.findAllPaginated(query);
  }

  /** Must be registered before GET :id */
  @Get('export')
  @ApiOperation({
    summary: 'Export sectors as CSV',
    description: 'Applies same search and status filters as the list (no pagination).',
  })
  @ApiResponse({ status: 200, description: 'CSV file download' })
  async exportCsv(@Query() query: ListSectorsQueryDto) {
    const csv = await this.sectorsService.buildCsvExport(query);
    const buf = Buffer.from(csv, 'utf-8');
    return new StreamableFile(buf, {
      type: 'text/csv; charset=utf-8',
      disposition: 'attachment; filename="sectors-export.csv"',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sector by id' })
  @ApiParam({ name: 'id', description: 'Numeric sector id' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id') id: string) {
    const numericId = this.sectorsService.parseSectorId(id);
    const data = await this.sectorsService.findOneById(numericId);
    return {
      message: 'Sector retrieved successfully',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create sector' })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@Body() dto: CreateSectorDto) {
    const data = await this.sectorsService.create(dto);
    return {
      message: 'Sector created successfully',
      data,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update sector name, description and/or status' })
  @ApiParam({ name: 'id', description: 'Numeric sector id' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateSectorDto) {
    const numericId = this.sectorsService.parseSectorId(id);
    const data = await this.sectorsService.update(numericId, dto);
    return {
      message: 'Sector updated successfully',
      data,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Set sector status (active/inactive)' })
  @ApiParam({ name: 'id', description: 'Numeric sector id' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async patchStatus(@Param('id') id: string, @Body() dto: UpdateSectorStatusDto) {
    const numericId = this.sectorsService.parseSectorId(id);
    const data = await this.sectorsService.updateStatus(numericId, dto);
    return {
      message: 'Sector status updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete sector' })
  @ApiParam({ name: 'id', description: 'Numeric sector id' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id') id: string) {
    const numericId = this.sectorsService.parseSectorId(id);
    const data = await this.sectorsService.softDelete(numericId);
    return {
      message: 'Sector deleted successfully',
      data,
    };
  }
}
