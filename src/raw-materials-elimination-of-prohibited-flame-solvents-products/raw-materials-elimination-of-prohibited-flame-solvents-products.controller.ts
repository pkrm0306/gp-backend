import {
  Controller,
  Get,
  Param,
  Post,
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
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { parseMultipartJsonIdArray } from '../product-design/product-design-upload.util';
import { rawMaterialsMultipartMemoryMulterOptions } from '../common/raw-materials/raw-materials-upload.util';
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
  assertRawMaterialsDocumentTypes,
  collectAllUploadFiles,
  parseMultipartJsonArray,
  parseRequiredRawMaterialsUrn,
  resolveRawMaterialsProductsPayload,
  shouldReplaceRawMaterialsTableBeforeInsert,
} from '../common/raw-materials/raw-materials-upload.util';

const SOLVENTS_PRODUCT_FILE_FIELDS = [
  'prohibitedFlameSolventsFile',
  'prohibitedFlameSolventsProductsFile',
  'productsTestReportFile',
  'productsTestReportFiles',
  'file',
  'files',
  'document',
  'documents',
];

const SOLVENTS_PRODUCTS_DOCUMENT_FORMS = [
  DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS_PRODUCTS,
  DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
];

function collectSolventsProductUploadFiles(
  uploadedFiles?: Express.Multer.File[],
): Express.Multer.File[] {
  const all = collectAllUploadFiles(uploadedFiles);
  const matched = all.filter((f) =>
    SOLVENTS_PRODUCT_FILE_FIELDS.includes(String(f.fieldname ?? '')),
  );
  return matched.length > 0 ? matched : all;
}

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
      '**Full replace** of product rows. Send complete `products` JSON array. Multiple supporting files allowed. `existingDocumentIds`: omit = keep all docs; `[]` = remove unlisted.',
  })
  @UseInterceptors(
    AnyFilesInterceptor(rawMaterialsMultipartMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo', 'products'],
      properties: {
        urnNo: { type: 'string' },
        products: {
          oneOf: [
            { type: 'array', items: { type: 'object' } },
            {
              type: 'string',
              description: 'JSON stringified products array for multipart',
            },
          ],
        },
        existingDocumentIds: { type: 'string' },
        prohibitedFlameSolventsFile: {
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
    const productsJson = resolveRawMaterialsProductsPayload(body);
    const meaningfulIncoming = productsJson.filter((row) =>
      hasPartialRawMaterialsProductRow(normalizeRawMaterialsProductRow(row)),
    );
    const uploadFiles = collectSolventsProductUploadFiles(
      req.files as Express.Multer.File[] | undefined,
    );

    if (uploadFiles.length > 0) {
      assertRawMaterialsDocumentTypes(uploadFiles);
    }

    const persistedProductCount =
      await this.service.countMeaningfulProductsByUrn(urnNo, user.vendorId);

    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm: SOLVENTS_PRODUCTS_DOCUMENT_FORMS,
      files: uploadFiles,
      rows:
        meaningfulIncoming.length > 0
          ? meaningfulIncoming
          : hasPartialRawMaterialsProductRow(
                normalizeRawMaterialsProductRow(body),
              )
            ? [normalizeRawMaterialsProductRow(body) as Record<string, unknown>]
            : productsJson,
      body,
      multipartBody: body,
      persistedRecordCount: persistedProductCount,
    });

    const data = await this.service.replaceByUrn({
      urnNo,
      vendorId: user.vendorId,
      products: productsJson,
      uploadedFiles: uploadFiles,
      existingDocumentIds: parseMultipartJsonIdArray(body.existingDocumentIds),
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
      'Inserts one row unless `replaceTable=true` or `rowIndex=0`. Supports optional supporting PDF/Excel uploads with text-only or file-only partial saves.',
  })
  @UseInterceptors(
    AnyFilesInterceptor(rawMaterialsMultipartMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo'],
      properties: {
        urnNo: { type: 'string' },
        productsName: { type: 'string' },
        productsTestReport: { type: 'string' },
        productsTestReportFileName: { type: 'string' },
        prohibitedFlameSolventsFile: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
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
    const uploadFiles = collectSolventsProductUploadFiles(
      req.files as Express.Multer.File[] | undefined,
    );
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
      documentForm: SOLVENTS_PRODUCTS_DOCUMENT_FORMS,
      files: uploadFiles,
      rows: [productRow as Record<string, unknown>],
      body,
      persistedRecordCount: replaceTableBeforeInsert ? 0 : meaningfulProductCount,
    });

    if (!hasProductText && uploadFiles.length > 0) {
      const data = await this.service.create(
        { urnNo },
        user.vendorId,
        { uploadFiles },
      );
      return {
        success: true,
        message:
          'Raw materials prohibited flame solvents products saved successfully',
        data,
      };
    }

    const dto: CreateRawMaterialsEliminationOfProhibitedFlameSolventsProductsDto = {
      urnNo,
      productsName: productRow.productName,
      productsTestReport: productRow.testReportReference,
    };

    const data = await this.service.create(dto, user.vendorId, {
      replaceTableBeforeInsert,
      uploadFiles,
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
    summary: 'List prohibited flame solvents product rows by URN',
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
