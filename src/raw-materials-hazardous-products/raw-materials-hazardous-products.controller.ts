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
  parseRawMaterialsFormString,
  parseRequiredRawMaterialsUrn,
  pickUploadFile,
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

  @Post()
  @ApiOperation({
    summary: 'Save hazardous products and/or test report files (per URN)',
    description:
      'Product name and test report reference are optional individually. File-only uploads are stored in hazardous products documents only — they do not populate the product metadata table on GET.',
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
        productsTestReportFileName: { type: 'string' },
        productsTestReportFile: { type: 'string', format: 'binary' },
        productsTestReportFiles: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
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
      textValues: [productRow.productName, productRow.testReportReference],
      persistedRecordCount: meaningfulProductCount,
    });

    if (!hasProductText && uploadFiles.length > 0) {
      const data = await this.service.createDocumentsOnly(
        urnNo,
        user.vendorId,
        uploadFiles,
      );
      return {
        success: true,
        message: 'Raw materials hazardous products saved successfully',
        data,
      };
    }

    const dto: CreateRawMaterialsHazardousProductsDto = {
      urnNo,
      productsName: productRow.productName,
      productsTestReport: productRow.testReportReference,
      productsTestReportFileName: parseRawMaterialsFormString(
        body.productsTestReportFileName,
      ),
    };

    const data = await this.service.create(
      dto,
      user.vendorId,
      primaryFile,
    );
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
