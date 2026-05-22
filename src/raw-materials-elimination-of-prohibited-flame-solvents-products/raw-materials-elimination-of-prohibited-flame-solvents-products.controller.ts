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
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';
import { normalizeRawMaterialsProductRow } from '../common/form-partial-field.util';
import { RawMaterialsEliminationOfProhibitedFlameSolventsProductsService } from './raw-materials-elimination-of-prohibited-flame-solvents-products.service';
import { CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto } from './dto/create-raw-materials-elimination-of-prohibited-flame-solvents-products.dto';
import { parseRequiredRawMaterialsUrn } from '../common/raw-materials/raw-materials-upload.util';

@ApiTags('Raw Materials Elimination Of Prohibited Flame Solvents Products')
@Controller('raw-materials-elimination-of-prohibited-flame-solvents-products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsEliminationOfProhibitedFlameSolventsProductsController {
  constructor(
    private readonly service: RawMaterialsEliminationOfProhibitedFlameSolventsProductsService,
    private readonly stepGate: RawMaterialsStepGateService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create raw materials elimination of prohibited flame solvents products record (per URN)',
  })
  @ApiBody({
    type: CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto,
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: Record<string, unknown>,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const urnNo = parseRequiredRawMaterialsUrn(body);
    const productRow = normalizeRawMaterialsProductRow(body);
    const dto: CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto = {
      urnNo,
      productsName: productRow.productName,
      productsTestReport: productRow.testReportReference,
    };
    const meaningfulProductCount =
      await this.service.countMeaningfulProductsByUrn(urnNo, user.vendorId);
    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm:
        DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
      rows: [productRow as Record<string, unknown>],
      rowKeys: ['productName', 'testReportReference'],
      persistedRecordCount: meaningfulProductCount,
    });
    const data = await this.service.create(dto, user.vendorId);
    return {
      success: true,
      message:
        'Raw materials prohibited flame solvents products saved successfully',
      data,
    };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary:
      'List raw materials elimination of prohibited flame solvents products records by URN',
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
