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
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PlantMergeService } from './plant-merge.service';
import { PlantMergeUrnPreviewService } from './services/plant-merge-urn-preview.service';
import { PlantMergeUrnValidationService } from './services/plant-merge-urn-validation.service';
import { PlantMergeUrnExecuteService } from './services/plant-merge-urn-execute.service';
import { PlantMergePreviewQueryDto } from './dto/plant-merge-preview-query.dto';
import { PlantMergeUrnPreviewQueryDto } from './dto/plant-merge-urn-preview-query.dto';
import { PlantMergeValidateDto } from './dto/plant-merge-validate.dto';
import { PlantMergeUrnExecuteDto } from './dto/plant-merge-urn-execute.dto';
import { PlantMergeExecuteDto } from './dto/plant-merge-execute.dto';
import { normalizeTrimmedValue } from '../helpers/merge-eligibility.shared';

@ApiTags('Admin Plant Merge')
@Controller('api/admin/products/plant-merge')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PlantMergeController {
  constructor(
    private readonly plantMergeService: PlantMergeService,
    private readonly plantMergeUrnPreviewService: PlantMergeUrnPreviewService,
    private readonly plantMergeUrnValidationService: PlantMergeUrnValidationService,
    private readonly plantMergeUrnExecuteService: PlantMergeUrnExecuteService,
  ) {}

  @Post('validate')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate a plant merge pair (source URN/EOI → target URN/EOI)',
  })
  @ApiResponse({ status: 200, description: 'Validation result with blockers' })
  async validate(@Body() dto: PlantMergeValidateDto) {
    return this.plantMergeUrnValidationService.validate(dto);
  }

  @Get('urn-preview')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @ApiOperation({
    summary:
      'Preview plant merge targets for each certified EOI on a source URN (read-only)',
  })
  @ApiResponse({ status: 200, description: 'URN-level plant merge target preview' })
  async urnPreview(@Query() query: PlantMergeUrnPreviewQueryDto) {
    return this.plantMergeUrnPreviewService.previewBySourceUrn(query.sourceUrnNo);
  }

  @Get('preview')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @ApiOperation({ summary: 'Preview merging source plants into a target plant' })
  @ApiResponse({ status: 200, description: 'Plant merge preview' })
  async preview(@Query() query: PlantMergePreviewQueryDto) {
    const sourcePlantIds = normalizeTrimmedValue(query.sourcePlantIds)
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    return this.plantMergeService.preview(
      query.productId,
      query.targetPlantId,
      sourcePlantIds,
    );
  }

  private adminUserId(user: { userId?: string; id?: string }): string {
    const adminUserId = String(user?.userId ?? user?.id ?? '').trim();
    if (!adminUserId) {
      throw new BadRequestException('Admin user id not found in token');
    }
    return adminUserId;
  }

  @Post('urn-execute')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Execute URN-level plant merge (copy source product plants to target products)',
  })
  @ApiResponse({ status: 200, description: 'URN-level plant merge completed' })
  async urnExecute(
    @Body() dto: PlantMergeUrnExecuteDto,
    @CurrentUser() user: { userId?: string; id?: string },
  ) {
    return this.plantMergeUrnExecuteService.execute(
      dto,
      this.adminUserId(user),
    );
  }

  @Post()
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Execute plant merge (absorb source plants into target plant)',
  })
  @ApiResponse({ status: 200, description: 'Plant merge completed' })
  async execute(
    @Body() dto: PlantMergeExecuteDto,
    @CurrentUser() user: { userId?: string; id?: string },
  ) {
    return this.plantMergeService.execute(dto, this.adminUserId(user));
  }
}
