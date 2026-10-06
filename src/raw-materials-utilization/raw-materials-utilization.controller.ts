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
  Inject,
  forwardRef,
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
import { filterUploadFilesByFieldNames } from '../common/raw-materials/raw-materials-desired-document-sync.util';
import { parseMultipartJsonIdArray } from '../product-design/product-design-upload.util';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';
import { RawMaterialsUtilizationService } from './raw-materials-utilization.service';
import { RawMaterialsUtilizationManufacturingUnitsService } from '../raw-materials-utilization-manufacturing-units/raw-materials-utilization-manufacturing-units.service';
import { CreateRawMaterialsUtilizationDto } from './dto/create-raw-materials-utilization.dto';
import {
  assertRawMaterialsDocumentTypes,
  collectAllUploadFiles,
  parseRawMaterialsFormString,
  parseRequiredRawMaterialsUrn,
} from '../common/raw-materials/raw-materials-upload.util';

@ApiTags('Raw Materials Utilization')
@Controller('raw-materials-utilization')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsUtilizationController {
  constructor(
    private readonly service: RawMaterialsUtilizationService,
    private readonly stepGate: RawMaterialsStepGateService,
    @Inject(forwardRef(() => RawMaterialsUtilizationManufacturingUnitsService))
    private readonly manufacturingUnitsService: RawMaterialsUtilizationManufacturingUnitsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials utilization record (per URN)',
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
          example: 'Raw materials utilization strategy and implementation details.',
        },
        utilizationFileName: {
          type: 'string',
          example: 'Raw Materials Utilization Supporting Document - 2026',
        },
        utilizationFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFiles() uploadedFiles?: Express.Multer.File[],
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const urnNo = parseRequiredRawMaterialsUrn(body);
    const dto: CreateRawMaterialsUtilizationDto = {
      urnNo,
      details: parseRawMaterialsFormString(body.details),
      utilizationFileName: parseRawMaterialsFormString(body.utilizationFileName),
    };
    const uploadFiles = filterUploadFilesByFieldNames(
      collectAllUploadFiles(uploadedFiles),
      ['utilizationFile'],
    );
    const existingDocumentIds = parseMultipartJsonIdArray(
      body.existingDocumentIds ?? body.existing_document_ids,
    );
    if (uploadFiles.length > 0) {
      assertRawMaterialsDocumentTypes(uploadFiles);
    }
    const [utilCount, mfgCount] = await Promise.all([
      this.service.countPersistedByUrn(urnNo, user.vendorId),
      this.manufacturingUnitsService.countPersistedByUrn(urnNo, user.vendorId),
    ]);
    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm: DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
      files: uploadFiles,
      textValues: [dto.details],
      persistedRecordCount: utilCount + mfgCount,
    });
    const data = await this.service.create(dto, user.vendorId, {
      uploadFiles,
      existingDocumentIds,
    });
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List raw materials utilization records by URN',
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
