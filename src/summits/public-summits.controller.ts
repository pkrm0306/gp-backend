import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { PublicListSummitsQueryDto } from './dto/public-list-summits-query.dto';
import { SummitsService } from './summits.service';

@ApiTags('Website Summits')
@Controller('website/summits')
@Public()
export class PublicSummitsController {
  constructor(private readonly summitsService: SummitsService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public summit listing (active only)',
    description:
      'Returns paginated summits with `status: active` only (legacy `published` included). ' +
      'Each row includes `coverImageUrl`, `excerpt`, and nested `preview` for card rendering. ' +
      'Default: page=1, limit=12 (max 50).',
  })
  @ApiResponse({ status: 200, description: 'Paginated active summits' })
  async list(@Req() req: Request, @Query() query: PublicListSummitsQueryDto) {
    const origin = `${req.protocol}://${req.get('host')}`;
    return this.summitsService.buildPublicListResponse(query, origin);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public summit listing (alias of GET /website/summits/list)',
    description:
      'Same paginated card preview payload as `/website/summits/list` — `coverImageUrl`, `excerpt`, and `preview`.',
  })
  @ApiResponse({ status: 200, description: 'Paginated active summits' })
  async listRoot(@Req() req: Request, @Query() query: PublicListSummitsQueryDto) {
    return this.list(req, query);
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Public summit detail by slug',
    description:
      'Active summits only. `data.visibleSections` lists filled sections for tab/nav rendering. ' +
      'Inactive summits return 404.',
  })
  @ApiParam({ name: 'slug', example: 'greenpro-summit-2026' })
  @ApiResponse({ status: 404, description: 'Not found or inactive' })
  async getBySlug(@Req() req: Request, @Param('slug') slug: string) {
    const origin = `${req.protocol}://${req.get('host')}`;
    const data = await this.summitsService.findPublishedBySlug(slug, origin);
    return {
      message: 'Summit retrieved successfully',
      data,
    };
  }
}
