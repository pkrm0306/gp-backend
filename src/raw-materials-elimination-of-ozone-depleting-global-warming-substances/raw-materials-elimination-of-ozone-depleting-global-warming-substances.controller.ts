import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { rawMaterialsMultipartMemoryMulterOptions } from '../common/raw-materials/raw-materials-upload.util';
import { filterUploadFilesByFieldNames } from '../common/raw-materials/raw-materials-desired-document-sync.util';
import { parseMultipartJsonIdArray } from '../product-design/product-design-upload.util';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateRawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesDto } from './dto/create-raw-materials-elimination-of-ozone-depleting-global-warming-substances.dto';
import { RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesService } from './raw-materials-elimination-of-ozone-depleting-global-warming-substances.service';
import {
  assertRawMaterialsDocumentTypes,
  collectAllUploadFiles,
  parseRequiredRawMaterialsUrn,
} from '../common/raw-materials/raw-materials-upload.util';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';


@ApiTags('Raw Materials Elimination Of Ozone Depleting And Global Warming Substances')
@Controller('raw-materials-elimination-of-ozone-depleting-global-warming-substances')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesController {
    constructor(
    private readonly service: RawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesService,
    private readonly stepGate: RawMaterialsStepGateService,
  ) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor(rawMaterialsMultipartMemoryMulterOptions()),
  )
  @ApiOperation({
    summary:
      'Upload absence of ozone depleting/global warming substances document (per URN)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo'],
      properties: {
        urnNo: { type: 'string', example: 'URN-20260305124230' },
        ozoneReportFileName: {
          type: 'string',
          example: 'Absence of Ozone Depleting Test Report - 2026',
        },
        ozoneReportFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Uploaded successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFiles() uploadedFiles?: Express.Multer.File[],
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const dto: CreateRawMaterialsEliminationOfOzoneDepletingGlobalWarmingSubstancesDto = {
      urnNo: parseRequiredRawMaterialsUrn(body),
      ozoneReportFileName: body.ozoneReportFileName,
    };

    const uploadFiles = filterUploadFilesByFieldNames(
      collectAllUploadFiles(uploadedFiles),
      ['ozoneReportFile'],
    );
    const existingDocumentIds = parseMultipartJsonIdArray(
      body.existingDocumentIds ?? body.existing_document_ids,
    );
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
        DocumentSectionKey.RAW_MATERIALS_ELIMINATION_OF_OZONE_DEPLETING_GLOBAL_WARMING_SUBSTANCES,
      files: uploadFiles,
      textValues: [dto.ozoneReportFileName],
      persistedRecordCount,
    });

    const data = await this.service.create(dto, user.vendorId, { uploadFiles, existingDocumentIds });
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List ozone depleting/global warming documents by URN',
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

