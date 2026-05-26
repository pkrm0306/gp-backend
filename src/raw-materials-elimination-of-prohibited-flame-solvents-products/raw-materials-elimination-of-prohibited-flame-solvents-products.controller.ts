import {
  Controller,
  Get,
  Param,
  Post,
  Req,
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
import type { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';
import {
  hasPartialRawMaterialsProductRow,
  normalizeRawMaterialsProductRow,
} from '../common/form-partial-field.util';
import { RawMaterialsEliminationOfProhibitedFlameSolventsProductsService } from './raw-materials-elimination-of-prohibited-flame-solvents-products.service';
import { CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto } from './dto/create-raw-materials-elimination-of-prohibited-flame-solvents-products.dto';
import {
  parseMultipartJsonArray,
  parseRequiredRawMaterialsUrn,
  shouldReplaceRawMaterialsTableBeforeInsert,
} from '../common/raw-materials/raw-materials-upload.util';

@ApiTags('Raw Materials Elimination Of Prohibited Flame Solvents Products')
@Controller('raw-materials-elimination-of-prohibited-flame-solvents-products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsEliminationOfProhibitedFlameSolventsProductsController {
  constructor(
    private readonly service: RawMaterialsEliminationOfProhibitedFlameSolventsProductsService,
    private readonly stepGate: RawMaterialsStepGateService,
  ) {}

  @Post('replace')
  @ApiOperation({
    summary:
      'Replace all prohibited flame solvents product rows for a URN (full snapshot)',
    description:
      '**Full replace** of product rows. Send complete `products` JSON array. Empty `[]` clears all rows.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo', 'products'],
      properties: {
        urnNo: { type: 'string' },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productsName: { type: 'string' },
              productsTestReport: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Replaced successfully' })
  async replace(@CurrentUser() user: any, @Req() req: Request) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const urnNo = parseRequiredRawMaterialsUrn(body);
    const productsJson = Array.isArray(body.products)
      ? body.products
      : parseMultipartJsonArray(body.products, 'products');

    const meaningfulIncoming = (productsJson as Array<Record<string, unknown>>).filter(
      (row) => hasPartialRawMaterialsProductRow(normalizeRawMaterialsProductRow(row)),
    );

    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm:
        DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS,
      rows: meaningfulIncoming,
      rowKeys: ['productName', 'testReportReference'],
      persistedRecordCount: 0,
    });

    const data = await this.service.replaceByUrn({
      urnNo,
      vendorId: user.vendorId,
      products: productsJson as Array<{
        productsName?: string;
        productsTestReport?: string;
      }>,
    });

    return {
      success: true,
      message:
        'Raw materials prohibited flame solvents products saved successfully',
      data,
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Save one solvents product row (legacy per-row POST)',
    description:
      'Inserts one row unless `replaceTable=true` or `rowIndex=0`. Legacy single POST without handshake replaces the full table.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo'],
      properties: {
        urnNo: { type: 'string' },
        productsName: { type: 'string' },
        productsTestReport: { type: 'string' },
        replaceTable: { type: 'string' },
        rowIndex: { type: 'string' },
        totalRows: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Saved successfully' })
  async create(@CurrentUser() user: any, @Req() req: Request) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const urnNo = parseRequiredRawMaterialsUrn(body);
    const productRow = normalizeRawMaterialsProductRow(body);
    const replaceTableBeforeInsert =
      shouldReplaceRawMaterialsTableBeforeInsert(body);

    const meaningfulProductCount =
      await this.service.countMeaningfulProductsByUrn(urnNo, user.vendorId);

    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm:
        DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS,
      rows: [productRow as Record<string, unknown>],
      rowKeys: ['productName', 'testReportReference'],
      persistedRecordCount: replaceTableBeforeInsert ? 0 : meaningfulProductCount,
    });

    const dto: CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto = {
      urnNo,
      productsName: productRow.productName,
      productsTestReport: productRow.testReportReference,
    };

    const data = await this.service.create(dto, user.vendorId, {
      replaceTableBeforeInsert,
    });
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
      'List prohibited flame solvents product rows by URN',
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
