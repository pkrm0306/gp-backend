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
import { RawMaterialsEliminationOfFormaldehydeService } from './raw-materials-elimination-of-formaldehyde.service';
import { CreateRawMaterialsEliminationOfFormaldehydeDto } from './dto/create-raw-materials-elimination-of-formaldehyde.dto';
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

const FORMALDEHYDE_FILE_FIELDS = ['formaldehydeFile', 'file', 'files', 'document'];

@ApiTags('Raw Materials Elimination Of Formaldehyde')
@Controller('raw-materials-elimination-of-formaldehyde')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsEliminationOfFormaldehydeController {
  constructor(
    private readonly service: RawMaterialsEliminationOfFormaldehydeService,
    private readonly stepGate: RawMaterialsStepGateService,
  ) {}

  @Post('replace')
  @ApiOperation({
    summary: 'Replace all formaldehyde product rows for a URN (full snapshot)',
    description:
      '**Full replace** of product rows for the URN. Send complete `products` JSON. `existingDocumentIds`: omit = keep all docs; `[]` = remove unlisted.',
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
        products: { type: 'string', description: 'JSON array (full replace)' },
        existingDocumentIds: { type: 'string' },
        formaldehydeFile: { type: 'array', items: { type: 'string', format: 'binary' } },
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
      FORMALDEHYDE_FILE_FIELDS.includes(String(f.fieldname ?? '')),
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
      documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
      files: uploadedFiles,
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
      uploadedFiles,
      existingDocumentIds: parseMultipartJsonIdArray(body.existingDocumentIds),
    });

    return {
      success: true,
      message: 'Raw materials formaldehyde saved successfully',
      data,
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Save one formaldehyde product row (legacy per-row POST)',
    description:
      'Inserts one row unless `replaceTable=true` or `rowIndex=0`. Legacy single POST without handshake replaces the full table (one-row vendor save).',
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
        productsName: { type: 'string' },
        productsTestReport: { type: 'string' },
        formaldehydeFileName: { type: 'string' },
        formaldehydeFile: { type: 'string', format: 'binary' },
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
    const uploadedFiles = collectAllUploadFiles(
      req.files as Express.Multer.File[] | undefined,
    );
    const uploadFiles = uploadedFiles.filter((f) =>
      FORMALDEHYDE_FILE_FIELDS.includes(String(f.fieldname ?? '')),
    );
    const formaldehydeFile =
      pickUploadFile(uploadFiles, FORMALDEHYDE_FILE_FIELDS) ?? uploadFiles[0];

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
      documentForm: DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_FORMALDEHYDE,
      files: uploadFiles,
      rows: [productRow as Record<string, unknown>],
      rowKeys: ['productName', 'testReportReference'],
      persistedRecordCount: replaceTableBeforeInsert ? 0 : meaningfulProductCount,
    });

    const dto: CreateRawMaterialsEliminationOfFormaldehydeDto = {
      urnNo,
      productsName: productRow.productName,
      productsTestReport: productRow.testReportReference,
      formaldehydeFileName: parseRawMaterialsFormString(body.formaldehydeFileName),
    };

    const data = await this.service.create(dto, user.vendorId, formaldehydeFile, {
      replaceTableBeforeInsert,
    });
    return {
      success: true,
      message: 'Raw materials formaldehyde saved successfully',
      data,
    };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List formaldehyde product rows for vendor table',
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
