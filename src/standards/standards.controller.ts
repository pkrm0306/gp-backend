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
      'Pagination, search on name, filter by resource_standard_type, **category_id**, and status, sort. Example: ?page=1&limit=10&search=energy&resource_standard_type=Energy&category_id=1&status=1. Each row includes **category_id** and **category_name** (from GET /categories) when linked.',
  })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  async findAll(@Query() query: ListStandardsQueryDto) {
    return this.standardsService.findAllPaginated(query);
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
      'Applies search, resource_standard_type, **category_id**, and status filters (no pagination).',
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
      'Response includes **category_id** and **category_name** for admin edit dropdowns.',
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
      'Form: **category_id** (required — numeric id from GET /categories), name, description (optional), resource_standard_type, status (optional, default 1), file (required). PDF, JPG, or PNG, max 10MB. Uses S3 when AWS_* env vars are set, else local uploads/standards/. ' +
      '**Compatibility:** Omitting category_id on create returns 400 validation. On update, omitting category_id leaves the existing link unchanged (older clients).',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['category_id', 'name', 'resource_standard_type', 'file'],
      properties: {
        category_id: {
          oneOf: [{ type: 'integer' }, { type: 'string' }],
          description: 'Product category id from GET /categories (`category_id` field)',
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
  ) {
    if (!file) {
      throw new BadRequestException(
        'File is required (field name: file). Allowed: PDF, JPG, PNG. Max 10MB.',
      );
    }
    const data = await this.standardsService.create(dto, file);
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
      'Optional fields: **category_id** (numeric id from GET /categories; omit to keep current), name, description, resource_standard_type, status, file (replace attachment). At least one field or file required. Empty category_id is treated as omitted. PDF, JPG, or PNG, max 10MB.',
  })
  @ApiParam({ name: 'id', description: 'Numeric standard id' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category_id: {
          oneOf: [{ type: 'integer' }, { type: 'string' }],
          description:
            'Optional. Must reference an existing category when provided. Omit to leave unchanged.',
        },
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
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const numericId = this.standardsService.parseStandardId(id);
    const data = await this.standardsService.update(numericId, dto, file);
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
