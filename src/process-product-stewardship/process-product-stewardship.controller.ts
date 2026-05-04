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
import { ProcessProductStewardshipService } from './process-product-stewardship.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessProductStewardshipDto } from './dto/create-process-product-stewardship.dto';

// Configure storage for process product stewardship documents
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

@ApiTags('Process Product Stewardship')
@Controller('process-product-stewardship')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessProductStewardshipController {
  constructor(
    private readonly processProductStewardshipService: ProcessProductStewardshipService,
  ) {}

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
        const allowedExtensions = [
          '.png',
          '.jpg',
          '.jpeg',
          '.pdf',
          '.doc',
          '.docx',
          '.xls',
          '.xlsx',
        ];
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
    summary: 'Create process product stewardship data',
    description:
      'Creates process product stewardship data with file uploads (SEA supporting documents, Quality Management supporting documents, and EPR supporting documents). Files are stored in URN-specific folder (uploads/urns/{urn_no}/). Supports multiple file types: PNG, JPEG, PDF, Word, and Excel files. Document metadata is stored in the master all_product_documents table.',
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
        qualityManagementDetails: {
          type: 'string',
          description: 'Quality management details (text)',
          example: 'Quality management implementation details',
        },
        eprImplementedDetails: {
          type: 'string',
          description: 'EPR implemented details (text)',
          example: 'EPR implementation details',
        },
        eprGreenPackagingDetails: {
          type: 'string',
          description: 'EPR green packaging details (text)',
          example: 'EPR green packaging details',
        },
        productStewardshipStatus: {
          type: 'number',
          description: 'Product stewardship status (0=Pending, 1=Completed)',
          example: 0,
          enum: [0, 1],
        },
        seaSupportingDocumentsFileName: {
          type: 'string',
          description:
            'SEA supporting documents display name (required if uploading seaSupportingDocumentsFile)',
          example: 'SEA Supporting Documents - March 2026',
        },
        qmSupportingDocumentsFileName: {
          type: 'string',
          description:
            'Quality Management supporting documents display name (required if uploading qmSupportingDocumentsFile)',
          example: 'Quality Management Supporting Documents - March 2026',
        },
        eprSupportingDocumentsFileName: {
          type: 'string',
          description:
            'EPR supporting documents display name (required if uploading eprSupportingDocumentsFile)',
          example: 'EPR Supporting Documents - March 2026',
        },
        seaSupportingDocumentsFile: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'SEA supporting documents files (multiple supported)',
        },
        qmSupportingDocumentsFile: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description:
            'Quality Management supporting documents files (multiple supported)',
        },
        eprSupportingDocumentsFile: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'EPR supporting documents files (multiple supported)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Process product stewardship created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            processProductStewardshipId: { type: 'number' },
            vendorId: { type: 'string' },
            urnNo: { type: 'string' },
            seaSupportingDocuments: { type: 'number' },
            qualityManagementDetails: { type: 'string' },
            qmSupportingDocuments: { type: 'number' },
            eprImplementedDetails: { type: 'string' },
            eprGreenPackagingDetails: { type: 'string' },
            eprSupportingDocuments: { type: 'number' },
            productStewardshipStatus: { type: 'number' },
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
    const dto: CreateProcessProductStewardshipDto = {
      urnNo: body.urnNo,
      qualityManagementDetails: body.qualityManagementDetails,
      eprImplementedDetails: body.eprImplementedDetails,
      eprGreenPackagingDetails: body.eprGreenPackagingDetails,
      productStewardshipStatus: body.productStewardshipStatus
        ? parseInt(body.productStewardshipStatus, 10)
        : undefined,
      seaSupportingDocumentsFileName: body.seaSupportingDocumentsFileName,
      qmSupportingDocumentsFileName: body.qmSupportingDocumentsFileName,
      eprSupportingDocumentsFileName: body.eprSupportingDocumentsFileName,
    };

    // Extract files by fieldname from the files array
    // AnyFilesInterceptor captures all files and stores them with their fieldname
    const seaSupportingDocumentsFiles = (files || []).filter(
      (f) => f.fieldname === 'seaSupportingDocumentsFile',
    );
    const qmSupportingDocumentsFiles = (files || []).filter(
      (f) => f.fieldname === 'qmSupportingDocumentsFile',
    );
    const eprSupportingDocumentsFiles = (files || []).filter(
      (f) => f.fieldname === 'eprSupportingDocumentsFile',
    );

    // Validate file names if files are uploaded
    if (
      seaSupportingDocumentsFiles.length > 0 &&
      (!dto.seaSupportingDocumentsFileName ||
        dto.seaSupportingDocumentsFileName.trim() === '')
    ) {
      throw new BadRequestException(
        'seaSupportingDocumentsFileName is required when uploading seaSupportingDocumentsFile',
      );
    }

    if (
      qmSupportingDocumentsFiles.length > 0 &&
      (!dto.qmSupportingDocumentsFileName ||
        dto.qmSupportingDocumentsFileName.trim() === '')
    ) {
      throw new BadRequestException(
        'qmSupportingDocumentsFileName is required when uploading qmSupportingDocumentsFile',
      );
    }

    if (
      eprSupportingDocumentsFiles.length > 0 &&
      (!dto.eprSupportingDocumentsFileName ||
        dto.eprSupportingDocumentsFileName.trim() === '')
    ) {
      throw new BadRequestException(
        'eprSupportingDocumentsFileName is required when uploading eprSupportingDocumentsFile',
      );
    }

    const data =
      await this.processProductStewardshipService.createProcessProductStewardship(
        dto,
        user.vendorId,
        seaSupportingDocumentsFiles,
        qmSupportingDocumentsFiles,
        eprSupportingDocumentsFiles,
      );
    return { success: true, data };
  }
}
