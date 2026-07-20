import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { AnyPermissions } from '../../common/decorators/any-permissions.decorator';
import { PRODUCTS_UPDATE_ANY } from '../../common/constants/permissions.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UrnMergeService } from './urn-merge.service';
import { UrnMergePreviewQueryDto } from './dto/urn-merge-preview-query.dto';
import { UrnMergeExecuteDto } from './dto/urn-merge-execute.dto';

@ApiTags('Admin URN Merge')
@Controller('api/admin/products/urn-merge')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UrnMergeController {
  constructor(private readonly urnMergeService: UrnMergeService) {}

  @Get('preview')
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @ApiOperation({ summary: 'Preview merging source URN into target URN' })
  @ApiResponse({ status: 200, description: 'Merge preview' })
  async preview(@Query() query: UrnMergePreviewQueryDto) {
    return this.urnMergeService.preview(
      query.sourceUrnNo,
      query.targetUrnNo,
    );
  }

  @Post()
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute URN merge (certified EOIs → target URN)' })
  @ApiResponse({ status: 200, description: 'Merge completed' })
  async execute(
    @Body() dto: UrnMergeExecuteDto,
    @CurrentUser() user: { userId?: string; id?: string },
  ) {
    const adminUserId = String(user?.userId ?? user?.id ?? '').trim();
    if (!adminUserId) {
      throw new BadRequestException('Admin user id not found in token');
    }
    return this.urnMergeService.execute(dto, adminUserId);
  }
}
