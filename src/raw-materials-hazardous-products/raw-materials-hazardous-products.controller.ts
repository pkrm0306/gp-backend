import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { parseMultipartJsonIdArray } from '../product-design/product-design-upload.util';
import { rawMaterialsMultipartMemoryMulterOptions } from '../common/raw-materials/raw-materials-upload.util';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';
import { RawMaterialsHazardousProductsService } from './raw-materials-hazardous-products.service';
import { CreateRawMaterialsHazardousProductsDto } from './dto/create-raw-materials-hazardous-products.dto';
import {
  hasPartialRawMaterialsProductRow,
  normalizeRawMaterialsProductRow,
} from '../common/form-partial-field.util';
import {
  assertRawMaterialsDocumentTypes,
  collectAllUploadFiles,
  parseMultipartJsonArray,
  parseRawMaterialsFormString,
  parseRequiredRawMaterialsUrn,
  pickUploadFile,
  shouldReplaceRawMaterialsTableBeforeInsert,
} from '../common/raw-materials/raw-materials-upload.util';

const HAZARDOUS_PRODUCT_FILE_FIELDS = [
  'productsTestReportFile',
  'productsTestReportFiles',
  'file',
  'files',
  'document',
];

@ApiTags('Raw Materials Hazardous Products')
@Controller('raw-materials-hazardous-products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsHazardousProductsController {
  constructor(
    private readonly service: RawMaterialsHazardousProductsService,
    private readonly stepGate: RawMaterialsStepGateService,
  ) {}

  @Post('replace')
  @ApiOperation({
    summary: 'Replace all hazardous product rows for a URN (full snapshot)',
    description:
      '**Full replace** of `raw_materials_hazardous_products` for the URN. Send the complete `products` JSON array from the vendor table. Empty `[]` clears all product rows. New files go to documents only when `products` is empty. `existingDocumentIds`: omit = keep all docs; `[]` = remove unlisted.',
  })
  @UseInterceptors(
    AnyFilesInterceptor(rawMaterialsMultipartMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo'],
      properties: {
        urnNo: { type: 'string' },
        eoiNo: { type: 'string' },
        products: {
          type: 'string',
          description: 'JSON array of product rows (full replace list)',
        },
        existingDocumentIds: {
          type: 'string',
          description: 'JSON array of productDocumentId to keep',
        },
        productsTestReportFile: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
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
    const productsJson = parseMultipartJsonArray(body.products, 'products');
    const uploadedFiles = collectAllUploadFiles(
      req.files as Express.Multer.File[] | undefined,
    ).filter((f) =>
      HAZARDOUS_PRODUCT_FILE_FIELDS.includes(String(f.fieldname ?? '')),
    );

    if (uploadedFiles.length > 0) {
      assertRawMaterialsDocumentTypes(uploadedFiles);
    }

    const meaningfulIncoming = (productsJson as Array<Record<string, unknown>>).filter(
      (row) => hasPartialRawMaterialsProductRow(normalizeRawMaterialsProductRow(row)),
    );

    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
      files: uploadedFiles,
      rows: meaningfulIncoming,
      rowKeys: ['productName', 'testReportReference'],
      persistedRecordCount: 0,
    });

    const data = await this.service.replaceByUrn({
      urnNo,
      vendorId: user.vendorId,
      eoiNo: parseRawMaterialsFormString(body.eoiNo),
      products: productsJson as Array<{
        productsName?: string;
        productsTestReport?: string;
        productsTestReportFileName?: string;
      }>,
      uploadedFiles,
      existingDocumentIds: parseMultipartJsonIdArray(body.existingDocumentIds),
    });

    return {
      success: true,
      message: 'Raw materials hazardous products saved successfully',
      data,
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Save one hazardous product row (legacy per-row POST)',
    description:
      'Inserts **one** row unless `replaceTable=true` or `rowIndex=0` (deletes all rows for URN first). ' +
      'Legacy single POST without handshake fields also replaces the full table (one-row vendor save). ' +
      'For multiple rows use `POST .../replace` or send `replaceTable=true` on the first row only.',
  })
  @UseInterceptors(
    AnyFilesInterceptor(rawMaterialsMultipartMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo'],
      properties: {
        urnNo: { type: 'string', example: 'URN-20260305124230' },
        eoiNo: { type: 'string' },
        productsName: { type: 'string' },
        productsTestReport: { type: 'string' },
        productsTestReportFileName: { type: 'string' },
        productsTestReportFile: { type: 'string', format: 'binary' },
        replaceTable: {
          type: 'string',
          description: 'true on first row of a multi-row save — deletes all rows before insert',
        },
        rowIndex: { type: 'string', description: '0-based index in this save batch' },
        totalRows: { type: 'string', description: 'Row count in this save batch' },
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
    const uploadedFiles = collectAllUploadFiles(
      req.files as Express.Multer.File[] | undefined,
    );
    const uploadFiles = uploadedFiles.filter((f) =>
      HAZARDOUS_PRODUCT_FILE_FIELDS.includes(String(f.fieldname ?? '')),
    );
    const primaryFile =
      pickUploadFile(uploadFiles, HAZARDOUS_PRODUCT_FILE_FIELDS) ??
      uploadFiles[0];

    const productRow = normalizeRawMaterialsProductRow(body);
    const hasProductText = hasPartialRawMaterialsProductRow(productRow);
    const replaceTableBeforeInsert =
      shouldReplaceRawMaterialsTableBeforeInsert(body);

    if (uploadFiles.length > 0) {
      assertRawMaterialsDocumentTypes(uploadFiles);
    }

    const meaningfulProductCount =
      await this.service.countMeaningfulProductsByUrn(urnNo, user.vendorId);

    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm: DocumentSectionKey.RAW_MATERIALS_HAZARDOUS_PRODUCTS,
      files: uploadFiles,
      rows: [productRow as Record<string, unknown>],
      rowKeys: ['productName', 'testReportReference'],
      persistedRecordCount: replaceTableBeforeInsert ? 0 : meaningfulProductCount,
    });

    if (!hasProductText && uploadFiles.length > 0) {
      const data = await this.service.createDocumentsOnly(
        urnNo,
        user.vendorId,
        uploadFiles,
        parseRawMaterialsFormString(body.eoiNo),
      );
      return {
        success: true,
        message: 'Raw materials hazardous products saved successfully',
        data,
      };
    }

    const dto: CreateRawMaterialsHazardousProductsDto = {
      urnNo,
      eoiNo: parseRawMaterialsFormString(body.eoiNo),
      productsName: productRow.productName,
      productsTestReport: productRow.testReportReference,
      productsTestReportFileName: parseRawMaterialsFormString(
        body.productsTestReportFileName,
      ),
    };

    const data = await this.service.create(dto, user.vendorId, primaryFile, {
      replaceTableBeforeInsert,
    });
    return {
      success: true,
      message: 'Raw materials hazardous products saved successfully',
      data,
    };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List hazardous product rows for vendor table (excludes file-only stubs)',
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
