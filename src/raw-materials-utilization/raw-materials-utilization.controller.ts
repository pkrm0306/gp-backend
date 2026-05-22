import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { certificationMultipartMemoryMulterOptions } from '../common/upload/multer-universal.config';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';
import { RawMaterialsUtilizationService } from './raw-materials-utilization.service';
import { RawMaterialsUtilizationManufacturingUnitsService } from '../raw-materials-utilization-manufacturing-units/raw-materials-utilization-manufacturing-units.service';
import { CreateRawMaterialsUtilizationDto } from './dto/create-raw-materials-utilization.dto';
import {
  assertRawMaterialsDocumentTypes,
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
    FileInterceptor('utilizationFile', certificationMultipartMemoryMulterOptions()),
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
    @UploadedFile() utilizationFile?: Express.Multer.File,
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
    if (utilizationFile) {
      assertRawMaterialsDocumentTypes([utilizationFile]);
    }
    const [utilCount, mfgCount] = await Promise.all([
      this.service.countPersistedByUrn(urnNo, user.vendorId),
      this.manufacturingUnitsService.countPersistedByUrn(urnNo, user.vendorId),
    ]);
    await this.stepGate.assertAtLeastOne({
      vendorId: user.vendorId,
      urnNo,
      documentForm: DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
      files: utilizationFile ? [utilizationFile] : [],
      textValues: [dto.details],
      persistedRecordCount: utilCount + mfgCount,
    });
    const data = await this.service.create(dto, user.vendorId, utilizationFile);
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
