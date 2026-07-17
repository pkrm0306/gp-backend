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
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { SummitsService } from './summits.service';
import { ListSummitsQueryDto } from './dto/list-summits-query.dto';
import { CreateSummitDto } from './dto/create-summit.dto';
import { UpdateSummitPayloadDto } from './dto/summit-payload.dto';
import { UpdateSummitStatusDto } from './dto/update-summit-status.dto';
import { SummitUploadQueryDto } from './dto/summit-upload.dto';
import { SUMMIT_SECTION_KEYS } from './constants/summit.constants';
import { summitUploadMulterOptions } from './utils/summit-upload.multer';

@ApiTags('Admin Summits')
@Controller('admin/summits')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminSummitsController {
  constructor(private readonly summitsService: SummitsService) {}

  @Get('list')
  @AnyPermissions(PERMISSIONS.SUMMITS_VIEW, PERMISSIONS.EVENTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List summits (card grid)',
    description:
      'Returns `data` as an array of list items (same shape as admin events list). ' +
      'Use `GET /admin/summits/list` or `GET /admin/summits`. Pagination in `pagination` + top-level totals.',
  })
  async listSummits(@Query() query: ListSummitsQueryDto) {
    return this.list(query);
  }

  @Get()
  @AnyPermissions(PERMISSIONS.SUMMITS_VIEW, PERMISSIONS.EVENTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List summits (alias of GET /admin/summits/list)' })
  async listRoot(@Query() query: ListSummitsQueryDto) {
    return this.list(query);
  }

  private async list(query: ListSummitsQueryDto) {
    const result = await this.summitsService.list(query);
    return {
      message: 'Summits retrieved successfully',
      data: result.items,
      items: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        perPage: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get('meta')
  @AnyPermissions(PERMISSIONS.SUMMITS_VIEW, PERMISSIONS.EVENTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Summit form metadata (year dropdown + status options)',
    description:
      'Use `years` for the year select in basic information. `occupiedYears` lists years already used by other summits (one summit per year). Status values are `active` and `inactive`.',
  })
  async getMeta(@Query('excludeSummitId') excludeSummitId?: string) {
    const data = await this.summitsService.getFormMeta(excludeSummitId);
    return {
      message: 'Summit form metadata retrieved successfully',
      data,
    };
  }

  @Get('preview/:slug')
  @AnyPermissions(PERMISSIONS.SUMMITS_VIEW, PERMISSIONS.EVENTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Preview summit by slug (active or inactive)',
    description:
      'Same payload as the public detail page (`GET /website/summits/:slug`) but allows inactive/draft summits for admin preview.',
  })
  @ApiParam({ name: 'slug', example: 'greenpro-summit-2026' })
  async previewBySlug(@Req() req: Request, @Param('slug') slug: string) {
    const origin = `${req.protocol}://${req.get('host')}`;
    const data = await this.summitsService.findBySlugForPreview(slug, origin);
    return {
      message: 'Summit preview retrieved successfully',
      data,
    };
  }

  @Post()
  @AnyPermissions(PERMISSIONS.SUMMITS_ADD, PERMISSIONS.EVENTS_ADD)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create summit (default status: inactive)' })
  async create(@Body() dto: CreateSummitDto) {
    const data = await this.summitsService.create(dto);
    return {
      message: 'Summit created successfully',
      data,
    };
  }

  @Get(':id')
  @AnyPermissions(PERMISSIONS.SUMMITS_VIEW, PERMISSIONS.EVENTS_VIEW)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get full summit document (edit / preview)' })
  @ApiParam({ name: 'id', description: 'Summit MongoDB id' })
  async getById(@Param('id') id: string) {
    if (id === 'list' || id === 'meta') {
      throw new BadRequestException(`Invalid summit id: ${id}`);
    }
    const data = await this.summitsService.findById(id);
    return {
      message: 'Summit retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @AnyPermissions(PERMISSIONS.SUMMITS_UPDATE, PERMISSIONS.EVENTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update full summit (final submit)' })
  async updateFull(@Param('id') id: string, @Body() body: UpdateSummitPayloadDto) {
    const data = await this.summitsService.updateFull(id, body);
    return {
      message: 'Summit updated successfully',
      data,
    };
  }

  @Patch(':id/status')
  @AnyPermissions(
    PERMISSIONS.SUMMITS_STATUS,
    PERMISSIONS.SUMMITS_UPDATE,
    PERMISSIONS.EVENTS_UPDATE,
  )
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set summit active or inactive (public site shows active only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSummitStatusDto,
  ) {
    const data = await this.summitsService.updateStatus(id, dto.status);
    return {
      message: 'Summit status updated successfully',
      data,
    };
  }

  @Patch(':id/sections/:section')
  @AnyPermissions(PERMISSIONS.SUMMITS_UPDATE, PERMISSIONS.EVENTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save one summit section' })
  @ApiParam({
    name: 'section',
    enum: SUMMIT_SECTION_KEYS,
  })
  async updateSection(
    @Param('id') id: string,
    @Param('section') section: string,
    @Body() body: Record<string, unknown>,
  ) {
    if (!SummitsService.isValidSection(section)) {
      throw new BadRequestException(
        `Invalid section. Allowed: ${SUMMIT_SECTION_KEYS.join(', ')}`,
      );
    }
    const result = await this.summitsService.updateSection(id, section, body);
    return {
      message: 'Summit section saved successfully',
      data: result,
    };
  }

  @Post(':id/upload')
  @AnyPermissions(PERMISSIONS.SUMMITS_UPDATE, PERMISSIONS.EVENTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', summitUploadMulterOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload banner, speaker, sponsor image, or PDF',
    description:
      'Query: type=banner|speaker|sponsor|pdf_industrial|pdf_buildings, optional itemId. Returns url + fileName for PATCH section.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async upload(
    @Param('id') id: string,
    @Query() query: SummitUploadQueryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('file is required');
    }
    const data = await this.summitsService.uploadAsset(
      id,
      query.type,
      file,
      query.itemId,
    );
    return {
      message: 'File uploaded successfully',
      data,
    };
  }

  @Delete(':id')
  @AnyPermissions(PERMISSIONS.SUMMITS_DELETE, PERMISSIONS.EVENTS_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete summit (soft delete)' })
  async remove(@Param('id') id: string) {
    const data = await this.summitsService.remove(id);
    return {
      message: 'Summit deleted successfully',
      data,
    };
  }
}
