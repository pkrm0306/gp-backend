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
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ProcessManufacturingService } from './process-manufacturing.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessManufacturingDto } from './dto/create-process-manufacturing.dto';

// Configure storage for process manufacturing documents
// Files will be moved to URN-specific folders in the service
const storage = diskStorage({
  destination: (req, file, cb) => {
    // Temporary directory - files will be moved to URN folder in service
    const tempDir = './uploads/temp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `temp-${uniqueSuffix}${ext}`);
  },
});

@ApiTags('Process Manufacturing')
@Controller('process-manufacturing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessManufacturingController {
  constructor(private readonly processManufacturingService: ProcessManufacturingService) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage,
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(null, true);
          return;
        }
        // Allow common document and image files
        const allowedMimes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/vnd.ms-excel', // .xls
        ];
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.doc', '.docx', '.xls', '.xlsx'];
        const fileExt = extname(file.originalname).toLowerCase();

        if (
          allowedMimes.includes(file.mimetype) ||
          allowedExtensions.includes(fileExt)
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Only PNG, JPEG, PDF, Word (.doc, .docx), and Excel (.xls, .xlsx) files are allowed.',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
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
          type: 'string',
          format: 'binary',
          description: 'Energy conservation supporting documents file',
        },
        energyConsumptionDocumentsFile: {
          type: 'string',
          format: 'binary',
          description: 'Energy consumption documents file',
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
    if (!user?.vendorId) throw new BadRequestException('Vendor ID not found in token');

    // Parse body to get DTO
    const dto: CreateProcessManufacturingDto = {
      urnNo: body.urnNo,
      portableWaterDemand: body.portableWaterDemand,
      rainWaterHarvesting: body.rainWaterHarvesting,
      beyondTheFenceInitiatives: body.beyondTheFenceInitiatives,
      totalEnergyConsumption: body.totalEnergyConsumption
        ? parseInt(body.totalEnergyConsumption, 10)
        : undefined,
      processManufacturingStatus: body.processManufacturingStatus
        ? parseInt(body.processManufacturingStatus, 10)
        : undefined,
      energyConservationSupportingDocumentsFileName: body.energyConservationSupportingDocumentsFileName,
      energyConsumptionDocumentsFileName: body.energyConsumptionDocumentsFileName,
    };

    // Extract files by fieldname from the files array
    // AnyFilesInterceptor captures all files and stores them with their fieldname
    const energyConservationFile = files?.find(
      (f) => f.fieldname === 'energyConservationSupportingDocumentsFile',
    );
    const energyConsumptionFile = files?.find(
      (f) => f.fieldname === 'energyConsumptionDocumentsFile',
    );

    // Validate file names if files are uploaded
    if (energyConservationFile && (!dto.energyConservationSupportingDocumentsFileName || dto.energyConservationSupportingDocumentsFileName.trim() === '')) {
      throw new BadRequestException(
        'energyConservationSupportingDocumentsFileName is required when uploading energyConservationSupportingDocumentsFile',
      );
    }

    if (energyConsumptionFile && (!dto.energyConsumptionDocumentsFileName || dto.energyConsumptionDocumentsFileName.trim() === '')) {
      throw new BadRequestException(
        'energyConsumptionDocumentsFileName is required when uploading energyConsumptionDocumentsFile',
      );
    }

    const data = await this.processManufacturingService.createProcessManufacturing(
      dto,
      user.vendorId,
      energyConservationFile,
      energyConsumptionFile,
    );
    return { success: true, data };
  }
}
