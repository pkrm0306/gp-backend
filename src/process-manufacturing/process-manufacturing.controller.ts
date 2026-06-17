import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { certificationMultipartMemoryMulterOptions } from '../common/upload/multer-universal.config';
import { ProcessManufacturingService } from './process-manufacturing.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessManufacturingDto } from './dto/create-process-manufacturing.dto';
import { parseOptionalDecimalNumber } from '../common/utils/parse-optional-number.util';
import {
  assertAtLeastOneProcessManufacturingField,
  collectProcessManufacturingUploadFiles,
} from './process-manufacturing-upload.util';

@ApiTags('Process Manufacturing')
@Controller('process-manufacturing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessManufacturingController {
  constructor(
    private readonly processManufacturingService: ProcessManufacturingService,
  ) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor(certificationMultipartMemoryMulterOptions()),
  )
  @ApiOperation({
    summary: 'Create process manufacturing data',
    description:
      'Creates process manufacturing data with file uploads (energy conservation supporting documents and energy consumption documents). Files are stored in URN-specific folder (uploads/urns/{urn_no}/). Supports multiple file types: PNG, JPEG, PDF, Word, and Excel files. Document metadata is stored in the master all_product_documents table.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo'],
      properties: {
        urnNo: {
          type: 'string',
          description: 'URN number',
          example: 'URN-20260305124230',
        },
        portableWaterDemand: {
          type: 'string',
          description: 'Portable water demand (text)',
          example: 'Water demand details',
        },
        rainWaterHarvesting: {
          type: 'string',
          description: 'Rain water harvesting (text)',
          example: 'Rain water harvesting details',
        },
        beyondTheFenceInitiatives: {
          type: 'string',
          description: 'Beyond the fence initiatives (text)',
          example: 'Beyond the fence initiatives details',
        },
        totalEnergyConsumption: {
          type: 'number',
          description: 'Total energy consumption',
          example: 5000,
        },
        processManufacturingStatus: {
          type: 'number',
          description: 'Process manufacturing status (0=Pending, 1=Completed)',
          example: 0,
          enum: [0, 1],
        },
        energyConservationSupportingDocumentsFileName: {
          type: 'string',
          description:
            'Energy conservation supporting documents display name (required if uploading energyConservationSupportingDocumentsFile)',
          example: 'Energy Conservation Supporting Documents - March 2026',
        },
        energyConsumptionDocumentsFileName: {
          type: 'string',
          description:
            'Energy consumption documents display name (required if uploading energyConsumptionDocumentsFile)',
          example: 'Energy Consumption Documents - March 2026',
        },
        energyConservationSupportingDocumentsFile: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description:
            'Energy conservation supporting documents files (multiple supported)',
        },
        energyConsumptionDocumentsFile: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description:
            'Energy consumption documents files (multiple supported)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Process manufacturing created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            processManufacturingId: { type: 'number' },
            vendorId: { type: 'string' },
            urnNo: { type: 'string' },
            energyConservationSupportingDocuments: { type: 'number' },
            portableWaterDemand: { type: 'string' },
            rainWaterHarvesting: { type: 'string' },
            beyondTheFenceInitiatives: { type: 'string' },
            totalEnergyConsumption: { type: 'number' },
            energyConsumptionDocuments: { type: 'number' },
            processManufacturingStatus: { type: 'number' },
            createdDate: { type: 'string', format: 'date-time' },
            updatedDate: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFiles() files?: Express.Multer.File[],
    @Req() req?: any,
  ) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');

    // Parse body to get DTO
    const dto: CreateProcessManufacturingDto = {
      urnNo: body.urnNo,
      portableWaterDemand: body.portableWaterDemand,
      rainWaterHarvesting: body.rainWaterHarvesting,
      beyondTheFenceInitiatives: body.beyondTheFenceInitiatives,
      totalEnergyConsumption: parseOptionalDecimalNumber(
        body.totalEnergyConsumption,
      ),
      processManufacturingStatus: body.processManufacturingStatus
        ? parseInt(body.processManufacturingStatus, 10)
        : undefined,
      energyConservationSupportingDocumentsFileName:
        body.energyConservationSupportingDocumentsFileName,
      energyConsumptionDocumentsFileName:
        body.energyConsumptionDocumentsFileName,
    };

    // Extract files by fieldname from the files array
    const { energyConservationFiles, energyConsumptionFiles } =
      collectProcessManufacturingUploadFiles(files);

    // Validate file names if files are uploaded
    if (
      energyConservationFiles.length > 0 &&
      (!dto.energyConservationSupportingDocumentsFileName ||
        dto.energyConservationSupportingDocumentsFileName.trim() === '')
    ) {
      throw new BadRequestException(
        'energyConservationSupportingDocumentsFileName is required when uploading energyConservationSupportingDocumentsFile',
      );
    }

    if (
      energyConsumptionFiles.length > 0 &&
      (!dto.energyConsumptionDocumentsFileName ||
        dto.energyConsumptionDocumentsFileName.trim() === '')
    ) {
      throw new BadRequestException(
        'energyConsumptionDocumentsFileName is required when uploading energyConsumptionDocumentsFile',
      );
    }

    if (
      dto.totalEnergyConsumption !== undefined &&
      dto.totalEnergyConsumption < 0
    ) {
      throw new BadRequestException(
        'Total energy consumption cannot be negative',
      );
    }

    const urnNo = String(dto.urnNo ?? '').trim();
    if (!urnNo) {
      throw new BadRequestException('URN number is required');
    }

    const retainedDocumentCount =
      await this.processManufacturingService.countRetainedProcessManufacturingDocuments(
        urnNo,
        user.vendorId,
      );

    assertAtLeastOneProcessManufacturingField({
      portableWaterDemand: dto.portableWaterDemand,
      rainWaterHarvesting: dto.rainWaterHarvesting,
      beyondTheFenceInitiatives: dto.beyondTheFenceInitiatives,
      totalEnergyConsumption: dto.totalEnergyConsumption,
      energyConservationFiles,
      energyConsumptionFiles,
      retainedDocumentCount,
    });

    const data =
      await this.processManufacturingService.createProcessManufacturing(
        dto,
        user.vendorId,
        energyConservationFiles,
        energyConsumptionFiles,
      );
    return { success: true, data };
  }
}
