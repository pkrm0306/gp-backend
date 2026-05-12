import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { ProcessWasteManagementService } from './process-waste-management.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessWasteManagementDto } from './dto/create-process-waste-management.dto';

// Configure storage for process waste management documents
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

@ApiTags('Process Waste Management')
@Controller('process-waste-management')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessWasteManagementController {
  constructor(
    private readonly processWasteManagementService: ProcessWasteManagementService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('wmSupportingDocumentsFile', {
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
    summary: 'Create process waste management data',
    description:
      'Creates process waste management data with supporting documents file upload. File is stored in URN-specific folder (uploads/urns/{urn_no}/). Supports multiple file types: PNG, JPEG, PDF, Word, and Excel files. Document metadata is stored in the master all_product_documents table.',
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
        wmImplementationDetails: {
          type: 'string',
          description: 'Waste management implementation details (text)',
          example: 'Implementation details for waste management',
        },
        processWasteManagementStatus: {
          type: 'number',
          description:
            'Process waste management status (0=Pending, 1=Completed)',
          example: 0,
          enum: [0, 1],
        },
        wmSupportingDocumentsFileName: {
          type: 'string',
          description:
            'Waste management supporting documents display name (required if uploading wmSupportingDocumentsFile)',
          example: 'Waste Management Supporting Documents - March 2026',
        },
        wmSupportingDocumentsFile: {
          type: 'string',
          format: 'binary',
          description: 'Waste management supporting documents file',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Process waste management created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            processWasteManagementId: { type: 'number' },
            vendorId: { type: 'string' },
            urnNo: { type: 'string' },
            wmImplementationDetails: { type: 'string' },
            wmSupportingDocuments: { type: 'number' },
            processWasteManagementStatus: { type: 'number' },
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
    @UploadedFile() wmSupportingDocumentsFile?: Express.Multer.File,
  ) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');

    const dto: CreateProcessWasteManagementDto = {
      urnNo: body.urnNo,
      wmImplementationDetails: body.wmImplementationDetails,
      processWasteManagementStatus: body.processWasteManagementStatus
        ? parseInt(body.processWasteManagementStatus, 10)
        : undefined,
      wmSupportingDocumentsFileName: body.wmSupportingDocumentsFileName,
    };

    // Validate file name if file is uploaded
    if (
      wmSupportingDocumentsFile &&
      (!dto.wmSupportingDocumentsFileName ||
        dto.wmSupportingDocumentsFileName.trim() === '')
    ) {
      throw new BadRequestException(
        'wmSupportingDocumentsFileName is required when uploading wmSupportingDocumentsFile',
      );
    }

    const data =
      await this.processWasteManagementService.createProcessWasteManagement(
        dto,
        user.vendorId,
        wmSupportingDocumentsFile,
      );
    return { success: true, data };
  }
}
