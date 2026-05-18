import {
  BadRequestException,
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
  Req,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { StandardsService } from './standards.service';
import { ListStandardsQueryDto } from './dto/list-standards-query.dto';
import { ListStandardsByCategoryQueryDto } from './dto/list-standards-by-category-query.dto';
import { ListStandardsBySectorQueryDto } from './dto/list-standards-by-sector-query.dto';
import { CreateStandardMultipartDto } from './dto/create-standard-multipart.dto';
import { UpdateStandardMultipartDto } from './dto/update-standard-multipart.dto';
import { UpdateStandardStatusDto } from './dto/update-standard-status.dto';
import { universalMemoryMulterOptions } from '../common/upload/multer-universal.config';

@ApiTags('Standards')
@Controller('api/standards')
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Get()
  @ApiOperation({
    summary: 'List standards (paginated)',
    description:
      'Pagination, search on name, filter by resource_standard_type, **category_id** (legacy primary or any linked category), **sector** (numeric sector `id` from GET /api/sectors — any category in that sector), and status, sort. Each row includes **category_ids**, **categories** `{ id, name }[]`, legacy **category_id** / **category_name**, and **sector_id** / **sector_ids** / **sector_name** (from the primary category’s sector) for admin sector dropdowns.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  async findAll(@Query() query: ListStandardsQueryDto) {
    return this.standardsService.findAllPaginated(query);
  }

  @Get('by-sector/:sectorId')
  @ApiOperation({
    summary: 'List standards for a sector (paginated)',
    description:
      'Same pagination and filters as GET /api/standards, except **do not pass sector** in the query — the sector is fixed by the path. **sectorId** is the numeric sector `id` from GET /api/sectors. Returns 400 if the sector does not exist.',
  })
  @ApiParam({
    name: 'sectorId',
    description: 'Numeric sector `id` from GET /api/sectors',
  })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  @ApiResponse({ status: 400, description: 'Invalid or unknown sector id' })
  async findBySector(
    @Param('sectorId') sectorId: string,
    @Query() query: ListStandardsBySectorQueryDto,
  ) {
    return this.standardsService.findAllPaginatedForSectorPath(sectorId, query);
  }

  @Get('by-category/:categoryId')
  @ApiOperation({
    summary: 'List standards for a category (paginated)',
    description:
      'Same pagination and filters as GET /api/standards, except **do not pass category_id** in the query — the category is fixed by the path. ' +
      '**categoryId** may be the numeric `category_id` from GET /categories or the category MongoDB `_id` (24-char hex). Returns 400 if the category does not exist.',
  })
  @ApiParam({
    name: 'categoryId',
    description:
      'Numeric `category_id` from GET /categories, or category document `_id` (MongoDB ObjectId string)',
  })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  @ApiResponse({ status: 400, description: 'Invalid or unknown category id' })
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: ListStandardsByCategoryQueryDto,
  ) {
    const cid =
      await this.standardsService.resolveCategoryIdForByCategoryRoute(
        categoryId,
      );
    return this.standardsService.findAllPaginated({
      ...query,
      category_id: cid,
    });
  }

  @Get('export')
  @ApiOperation({
    summary: 'Export standards as CSV',
    description:
      'Applies search, resource_standard_type, **category_id**, **sector**, and status filters (no pagination).',
  })
  @ApiResponse({ status: 200, description: 'CSV download' })
  async exportCsv(@Query() query: ListStandardsQueryDto) {
    const csv = await this.standardsService.buildCsvExport(query);
    const buf = Buffer.from(csv, 'utf-8');
    return new StreamableFile(buf, {
      type: 'text/csv; charset=utf-8',
      disposition: 'attachment; filename="standards-export.csv"',
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get standard by id',
    description:
      'Response includes **category_ids**, **categories**, legacy **category_id** / **category_name**, and **sector_id** / **sector_ids** / **sector_name** (primary category’s sector).',
  })
  @ApiParam({ name: 'id', description: 'Numeric standard id' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id') id: string) {
    const numericId = this.standardsService.parseStandardId(id);
    const data = await this.standardsService.findOneById(numericId);
    return {
      message: 'Standard retrieved successfully',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', universalMemoryMulterOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create standard (file upload)',
    description:
      'Form: **sectors** (required, multiselect) — one or more numeric sector ids from GET /api/sectors (sector names for the admin dropdown come from that list). Send as JSON array string `[1,2]`, repeated **sectors** / **sectors[]**, **sector_ids**, or **sectorIds**; legacy single **sector** is merged in. The standard is linked to **all** categories in each selected sector (union, deduped). Do not send category_id / category_ids / categoryIds. name; description (optional); resource_standard_type; status (optional, default 1); file (required). PDF, JPG, or PNG, max 10MB. Primary **category_id** on the document is the first category id in the merged set.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'resource_standard_type', 'file'],
      properties: {
        sectors: {
          oneOf: [
            { type: 'array', items: { type: 'integer' } },
            { type: 'string', description: 'JSON array of sector ids, e.g. "[1,2]"' },
          ],
          description:
            'Multiselect: one or more sector ids from GET /api/sectors (required unless using sector / sectors[] / sector_ids)',
        },
        sector: {
          oneOf: [{ type: 'integer' }, { type: 'string' }],
          description: 'Legacy single sector id (merged with sectors)',
        },
        'sectors[]': {
          oneOf: [
            { type: 'array', items: { type: 'integer' } },
            { type: 'string' },
          ],
          description: 'Repeated sector ids (multipart)',
        },
        sector_ids: {
          oneOf: [
            { type: 'array', items: { type: 'integer' } },
            { type: 'string', description: 'JSON array or comma-separated ids' },
          ],
        },
        sectorIds: {
          type: 'string',
          description: 'JSON array string of sector ids',
        },
        name: { type: 'string' },
        description: { type: 'string' },
        resource_standard_type: { type: 'string' },
        status: { type: 'integer', enum: [0, 1] },
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF, JPG, or PNG',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Invalid or missing file' })
  async create(
    @Body() dto: CreateStandardMultipartDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { body: Record<string, unknown> },
  ) {
    if (!file) {
      throw new BadRequestException(
        'File is required (field name: file). Allowed: PDF, JPG, PNG. Max 10MB.',
      );
    }
    const data = await this.standardsService.create(dto, file, req.body);
    return {
      message: 'Standard created successfully',
      data,
    };
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', universalMemoryMulterOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update standard',
    description:
      'Optional **sectors** (multiselect) or legacy **sector** — when sent, replaces linked categories with the **union** of all categories across the selected sectors (GET /api/sectors). Category fields are not accepted. Other fields: name, description, resource_standard_type, status, file. At least one field or file required.',
  })
  @ApiParam({ name: 'id', description: 'Numeric standard id' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sectors: {
          oneOf: [
            { type: 'array', items: { type: 'integer' } },
            { type: 'string', description: 'JSON array string' },
          ],
          description: 'Multiselect sector ids; replaces category links when sent',
        },
        sector: {
          oneOf: [{ type: 'integer' }, { type: 'string' }],
          description: 'Single sector id (legacy); merged with sectors',
        },
        'sectors[]': {
          oneOf: [{ type: 'array', items: { type: 'integer' } }, { type: 'string' }],
        },
        sector_ids: {
          oneOf: [
            { type: 'array', items: { type: 'integer' } },
            { type: 'string' },
          ],
        },
        sectorIds: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        resource_standard_type: { type: 'string' },
        status: { type: 'integer', enum: [0, 1] },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional replacement (PDF, JPG, PNG)',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStandardMultipartDto,
    @Req() req: { body: Record<string, unknown> },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const numericId = this.standardsService.parseStandardId(id);
    const data = await this.standardsService.update(numericId, dto, file, req.body);
    return {
      message: 'Standard updated successfully',
      data,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Set standard status' })
  @ApiParam({ name: 'id', description: 'Numeric standard id' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async patchStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStandardStatusDto,
  ) {
    const numericId = this.standardsService.parseStandardId(id);
    const data = await this.standardsService.updateStatus(numericId, dto);
    return {
      message: 'Standard status updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete standard and its file' })
  @ApiParam({ name: 'id', description: 'Numeric standard id' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id') id: string) {
    const numericId = this.standardsService.parseStandardId(id);
    await this.standardsService.remove(numericId);
    return {
      message: 'Standard deleted successfully',
      data: null,
    };
  }
}
