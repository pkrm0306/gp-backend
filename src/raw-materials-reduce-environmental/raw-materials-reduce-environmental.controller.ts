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
import { RawMaterialsReduceEnvironmentalService } from './raw-materials-reduce-environmental.service';
import { CreateRawMaterialsReduceEnvironmentalDto } from './dto/create-raw-materials-reduce-environmental.dto';
import {
  assertRawMaterialsDocumentTypes,
  collectAllUploadFiles,
  hasExplicitReduceEnvironmentalArray,
  parseRawMaterialsFormString,
  parseRequiredRawMaterialsUrn,
  resolveReduceEnvironmentalUnits,
  shouldReplaceRawMaterialsTableBeforeInsert,
} from '../common/raw-materials/raw-materials-upload.util';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';

const QUARRYING_UNIT_ROW_KEYS = [
  'location',
  'enhancementOfMinesLife',
  'topsoilConservation',
  'waterTableManagement',
  'restorationOfSpentMines',
  'greenBeltDevelopmentAndBioDiversity',
];

const REDUCE_ENV_FILE_FIELDS = [
  'reduceEnvironmentalFile',
  'reduceEnvironmentalFiles',
  'reduceEnviromentalFile',
  'reduceEnviromentalFiles',
  'file',
  'files',
  'supportingDocument',
  'supportingDocuments',
  'document',
  'documents',
];

function collectReduceEnvironmentalUploadFiles(
  uploadedFiles?: Express.Multer.File[],
): Express.Multer.File[] {
  const all = collectAllUploadFiles(uploadedFiles);
  const matched = all.filter((f) =>
    REDUCE_ENV_FILE_FIELDS.includes(String(f.fieldname ?? '')),
  );
  return matched.length > 0 ? matched : all;
}

@ApiTags('Raw Materials Reduce Environmental')
/** Vendor portal uses legacy typo `enviromental`; keep both paths. */
@Controller([
  'raw-materials-reduce-environmental',
  'raw-materials-reduce-enviromental',
])
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsReduceEnvironmentalController {
  constructor(
    private readonly service: RawMaterialsReduceEnvironmentalService,
    private readonly stepGate: RawMaterialsStepGateService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Save quarrying / reduce environmental mine rows (per URN)',
    description:
      '**Full replace** when `units` or `mines` JSON array is sent (including `[]` to clear). ' +
      'Legacy per-row multipart: send `replaceTable=true` or `rowIndex=0` on the **first** mine row; ' +
      'later rows append. Legacy single POST without handshake replaces with one row. ' +
      'Multiple `reduceEnvironmentalFile` uploads supported. `existingDocumentIds`: omit = keep all docs; `[]` = remove unlisted.',
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
        units: {
          type: 'string',
          description:
            'JSON array — full snapshot of mine rows for this URN (replaces all existing rows)',
        },
        mines: {
          type: 'string',
          description: 'Alias for `units` when `units` is omitted',
        },
        location: { type: 'string', example: 'Mine site location details' },
        locations: { type: 'string', example: 'Mine site location (alias)' },
        enhancementOfMinesLife: { type: 'string' },
        topsoilConservation: { type: 'string' },
        waterTableManagement: { type: 'string' },
        restorationOfSpentMines: { type: 'string' },
        greenBeltDevelopmentAndBioDiversity: { type: 'string' },
        replaceTable: {
          type: 'string',
          description: 'true on first row of legacy per-row loop — deletes all rows before insert',
        },
        rowIndex: { type: 'string', description: '0-based index in per-row save batch' },
        totalRows: { type: 'string', description: 'Row count in per-row save batch' },
        existingDocumentIds: {
          type: 'string',
          description: 'JSON array of productDocumentId to retain',
        },
        reduceEnvironmentalFileName: { type: 'string' },
        reduceEnvironmentalFile: {
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
    const uploadedFiles = collectReduceEnvironmentalUploadFiles(
      req.files as Express.Multer.File[] | undefined,
    );
    const reduceEnvironmentalFileName =
      parseRawMaterialsFormString(body.reduceEnvironmentalFileName) ??
      parseRawMaterialsFormString(body.reduce_environmental_file_name);

    if (uploadedFiles.length > 0) {
      assertRawMaterialsDocumentTypes(uploadedFiles);
    }

    const explicitArray = hasExplicitReduceEnvironmentalArray(body);
    const resolvedUnits = resolveReduceEnvironmentalUnits(
      body,
      QUARRYING_UNIT_ROW_KEYS,
    );
    const replaceAllRows =
      explicitArray || shouldReplaceRawMaterialsTableBeforeInsert(body);

    const persistedRecordCount = replaceAllRows
      ? 0
      : await this.service.countPersistedByUrn(urnNo, user.vendorId);

    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm: [
        DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIRONMENTAL,
        DocumentSectionKey.RAW_MATERIALS_REDUCE_ENVIROMENTAL,
      ],
      files: uploadedFiles,
      rows: resolvedUnits,
      rowKeys: QUARRYING_UNIT_ROW_KEYS,
      textValues: [reduceEnvironmentalFileName],
      body,
      multipartBody: body,
      persistedRecordCount,
    });

    const dto: CreateRawMaterialsReduceEnvironmentalDto = {
      urnNo,
      units: resolvedUnits,
      reduceEnvironmentalFileName: reduceEnvironmentalFileName ?? undefined,
    };

    const data = await this.service.create(dto, user.vendorId, {
      replaceAllRows,
      uploadFiles: uploadedFiles,
      existingDocumentIds: parseMultipartJsonIdArray(body.existingDocumentIds),
    });

    return {
      success: true,
      message: 'Reduce environmental quarrying details saved successfully',
      data,
    };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List raw materials reduce environmental records by URN',
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
