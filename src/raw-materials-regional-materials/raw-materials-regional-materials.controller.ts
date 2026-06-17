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
import { RawMaterialsRegionalMaterialsService } from './raw-materials-regional-materials.service';
import { CreateRawMaterialsRegionalMaterialsDto } from './dto/create-raw-materials-regional-materials.dto';
import {
  assertRawMaterialsDocumentTypes,
  collectAllUploadFiles,
  parseMultipartJsonArray,
  parseRequiredRawMaterialsUrn,
} from '../common/raw-materials/raw-materials-upload.util';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';


const REGIONAL_UNIT_ROW_KEYS = [
  'unitName',
  'year',
  'unit1',
  'yeardata1',
  'unit2',
  'yeardata2',
];

const REGIONAL_FILE_FIELDS = [
  'regionalMaterialsFile',
  'regionalMaterialsFiles',
  'regional_materials_file',
  'regional_materials_files',
  'file',
  'files',
  'supportingDocument',
  'supportingDocuments',
  'document',
  'documents',
];

function isRegionalMaterialsUploadField(fieldname: string): boolean {
  const field = String(fieldname ?? '').trim();
  if (!field) {
    return false;
  }
  if (REGIONAL_FILE_FIELDS.includes(field)) {
    return true;
  }
  return (
    field.startsWith('regionalMaterialsFile') ||
    field.startsWith('regional_materials_file')
  );
}

@ApiTags('Raw Materials Regional Materials')
@Controller('raw-materials-regional-materials')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsRegionalMaterialsController {
    constructor(
    private readonly service: RawMaterialsRegionalMaterialsService,
    private readonly stepGate: RawMaterialsStepGateService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials regional materials units (per URN)',
    description:
      '**units** replaces all rows for the URN. Multiple supporting PDF/Excel uploads supported via repeated `regionalMaterialsFile` fields. `existingDocumentIds`: omit = keep all saved docs; JSON array = retain only listed productDocumentId values.',
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
        regionalMaterialsFileName: {
          type: 'string',
          example: 'Regional Materials Supporting Document - 2026',
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
        regionalMaterialsFile: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'One or more supporting documents (PDF/Excel)',
        },
        existingDocumentIds: {
          type: 'string',
          description:
            'JSON array of productDocumentId values to retain when removing files',
        },
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
                  rawMaterialsRegionalMaterialsId: { type: 'number', example: 101 },
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
  async create(@CurrentUser() user: any, @Req() req: Request) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const units = parseMultipartJsonArray(body.units, 'units');
    const allUploadedFiles = collectAllUploadFiles(
      req.files as Express.Multer.File[] | undefined,
    );
    const uploadFiles = allUploadedFiles.filter((f) =>
      isRegionalMaterialsUploadField(String(f.fieldname ?? '')),
    );
    const resolvedUploadFiles =
      uploadFiles.length > 0 ? uploadFiles : allUploadedFiles;

    if (resolvedUploadFiles.length > 0) {
      assertRawMaterialsDocumentTypes(resolvedUploadFiles);
    }
    const urnNo = parseRequiredRawMaterialsUrn(body);
    const persistedRecordCount = await this.service.countPersistedByUrn(
      urnNo,
      user.vendorId,
    );
    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm: DocumentSectionKey.RAW_MATERIALS_REGIONAL_MATERIALS,
      files: resolvedUploadFiles,
      rows: units as Array<Record<string, unknown>>,
      rowKeys: REGIONAL_UNIT_ROW_KEYS,
      persistedRecordCount,
    });

    const dto: CreateRawMaterialsRegionalMaterialsDto = {
      urnNo,
      vendorId: body.vendorId as string | undefined,
      regionalMaterialsFileName: body.regionalMaterialsFileName as
        | string
        | undefined,
      units: units as CreateRawMaterialsRegionalMaterialsDto['units'],
    };

    const data = await this.service.create(dto, user.vendorId, {
      uploadFiles: resolvedUploadFiles,
      existingDocumentIds: parseMultipartJsonIdArray(body.existingDocumentIds),
    });
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'Get all raw materials regional materials units by URN',
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
