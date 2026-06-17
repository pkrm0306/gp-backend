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
import {
  assertRawMaterialsDocumentTypes,
  collectAllUploadFiles,
  parseRequiredRawMaterialsUrn,
} from '../common/raw-materials/raw-materials-upload.util';
import { rawMaterialsMultipartMemoryMulterOptions } from '../common/raw-materials/raw-materials-upload.util';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RawMaterialsEliminationOfProhibitedFlameSolventsService } from './raw-materials-elimination-of-prohibited-flame-solvents.service';
import { CreateRawMaterialsEliminationOfProhibitedFlameSolventsDto } from './dto/create-raw-materials-elimination-of-prohibited-flame-solvents.dto';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';

const SOLVENTS_FILE_FIELDS = [
  'prohibitedFlameSolventsFile',
  'prohibitedFlameSolventsFiles',
  'productsTestReportFile',
  'productsTestReportFiles',
  'file',
  'files',
  'document',
  'documents',
];

function collectSolventsUploadFiles(
  uploadedFiles?: Express.Multer.File[],
): Express.Multer.File[] {
  const all = collectAllUploadFiles(uploadedFiles);
  const matched = all.filter((f) =>
    SOLVENTS_FILE_FIELDS.includes(String(f.fieldname ?? '')),
  );
  return matched.length > 0 ? matched : all;
}

@ApiTags('Raw Materials Elimination Of Prohibited Flame Solvents')
@Controller('raw-materials-elimination-of-prohibited-flame-solvents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsEliminationOfProhibitedFlameSolventsController {
  constructor(
    private readonly service: RawMaterialsEliminationOfProhibitedFlameSolventsService,
    private readonly stepGate: RawMaterialsStepGateService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create raw materials elimination of prohibited flame solvents record (per URN)',
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
        details: {
          type: 'string',
          example: 'Eliminated prohibited flame solvents and replaced with compliant alternatives.',
        },
        prohibitedFlameSolventsFileName: {
          type: 'string',
          example: 'Prohibited Flame Solvents Supporting Document - 2026',
        },
        prohibitedFlameSolventsFile: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(@CurrentUser() user: any, @Req() req: Request) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const uploadFiles = collectSolventsUploadFiles(
      req.files as Express.Multer.File[] | undefined,
    );
    const dto: CreateRawMaterialsEliminationOfProhibitedFlameSolventsDto = {
      urnNo: parseRequiredRawMaterialsUrn(body),
      details: body.details as string | undefined,
      prohibitedFlameSolventsFileName: body.prohibitedFlameSolventsFileName as
        | string
        | undefined,
    };

    if (uploadFiles.length > 0) {
      assertRawMaterialsDocumentTypes(uploadFiles);
    }

    const persistedRecordCount = await this.service.countPersistedByUrn(
      dto.urnNo,
      user.vendorId,
    );
    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo: dto.urnNo,
      documentForm:
        DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_PROHIBITED_FLAME_SOLVENTS,
      files: uploadFiles,
      textValues: [dto.details, dto.prohibitedFlameSolventsFileName],
      body,
      multipartBody: body,
      persistedRecordCount,
    });

    const data = await this.service.create(
      dto,
      user.vendorId,
      uploadFiles[0],
    );
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary:
      'List raw materials elimination of prohibited flame solvents records by URN',
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
