import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
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
import { rawMaterialsMultipartMemoryMulterOptions } from '../common/raw-materials/raw-materials-upload.util';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RawMaterialsRapidlyRenewableMaterialsService } from './raw-materials-rapidly-renewable-materials.service';
import { CreateRawMaterialsRapidlyRenewableMaterialsDto } from './dto/create-raw-materials-rapidly-renewable-materials.dto';
import {
  assertRawMaterialsDocumentTypes,
  collectAllUploadFiles,
  parseMultipartJsonArray,
  parseRequiredRawMaterialsUrn,
} from '../common/raw-materials/raw-materials-upload.util';
import { filterUploadFilesByFieldNames } from '../common/raw-materials/raw-materials-desired-document-sync.util';
import { parseMultipartJsonIdArray } from '../product-design/product-design-upload.util';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';


const RAPIDLY_RENEWABLE_UNIT_ROW_KEYS = [
  'unitName',
  'year',
  'unit1',
  'yeardata1',
  'unit2',
  'yeardata2',
];

@ApiTags('Raw Materials Rapidly Renewable Materials')
@Controller([
  'raw-materials-rapidly-renewable-materials',
  'raw-materials-rapdly-renewable-materials',
])
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsRapidlyRenewableMaterialsController {
    constructor(
    private readonly service: RawMaterialsRapidlyRenewableMaterialsService,
    private readonly stepGate: RawMaterialsStepGateService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials rapidly renewable materials units (per URN)',
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
        urnNo: { type: 'string', example: 'URN-20260305124230' },
        vendorId: { type: 'string', example: '66f1abcdef1234567890abcd' },
        rapidlyRenewableFileName: {
          type: 'string',
          example: 'Rapidly Renewable Supporting Document - 2026',
        },
        units: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  unitName: { type: 'string', example: 'Test Unit 1' },
                  year: { type: 'number', example: 2024 },
                  unit1: { type: 'number', example: 1 },
                  yeardata1: { type: 'number', example: 10 },
                  unit2: { type: 'number', example: 1 },
                  yeardata2: { type: 'number', example: 5 },
                },
              },
            },
            {
              type: 'string',
              description: 'JSON stringified units array for multipart/form-data',
            },
          ],
        },
        rapidlyRenewableFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            urnNo: { type: 'string', example: 'URN-XXXX' },
            vendorId: { type: 'string', example: '66f1abcdef1234567890abcd' },
            units: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  rawMaterialsRapidlyRenewableMaterialsId: { type: 'number', example: 101 },
                  unitName: { type: 'string', example: 'Test Unit 1' },
                  year: { type: 'number', example: 2024 },
                  unit1: { type: 'number', example: 1 },
                  yeardata1: { type: 'number', example: 10 },
                  unit2: { type: 'number', example: 1 },
                  yeardata2: { type: 'number', example: 5 },
                  yeardata3: { type: 'number', example: 50 },
                },
              },
            },
            documents: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
      },
    },
  })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFiles() uploadedFiles?: Express.Multer.File[],
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const units = parseMultipartJsonArray(body.units, 'units');
    const uploadFiles = filterUploadFilesByFieldNames(
      collectAllUploadFiles(uploadedFiles),
      ['rapidlyRenewableFile', 'rapdlyRenewableFile', 'file', 'supportingDocument', 'document'],
    );
    const existingDocumentIds = parseMultipartJsonIdArray(
      body.existingDocumentIds ?? body.existing_document_ids,
    );

    if (uploadFiles.length > 0) {
      assertRawMaterialsDocumentTypes(uploadFiles);
    }
    const urnNo = parseRequiredRawMaterialsUrn(body);
    const persistedRecordCount = await this.service.countPersistedByUrn(
      urnNo,
      user.vendorId,
    );
    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm: DocumentSectionKey.RAW_MATERIALS_RAPIDLY_RENEWABLE_MATERIALS,
      files: uploadFiles,
      rows: units as Array<Record<string, unknown>>,
      rowKeys: RAPIDLY_RENEWABLE_UNIT_ROW_KEYS,
      persistedRecordCount,
    });

    const dto: CreateRawMaterialsRapidlyRenewableMaterialsDto = {
      urnNo,
      vendorId: body.vendorId,
      rapidlyRenewableFileName: body.rapidlyRenewableFileName,
      units: units as CreateRawMaterialsRapidlyRenewableMaterialsDto['units'],
    };

    const data = await this.service.create(dto, user.vendorId, {
      uploadFiles,
      existingDocumentIds,
    });
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'Get all raw materials rapidly renewable materials units by URN',
  })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            urnNo: { type: 'string', example: 'URN-XXXX' },
            vendorId: { type: 'string', example: '66f1abcdef1234567890abcd' },
            units: { type: 'array', items: { type: 'object' } },
            documents: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
  })
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
