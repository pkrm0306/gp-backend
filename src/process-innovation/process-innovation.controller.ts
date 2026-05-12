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
import { ProcessInnovationService } from './process-innovation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessInnovationDto } from './dto/create-process-innovation.dto';

// Configure storage for process innovation documents
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

@ApiTags('Process Innovation')
@Controller('process-innovation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessInnovationController {
  constructor(
    private readonly processInnovationService: ProcessInnovationService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('innovationImplementationDocumentsFile', {
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
    summary: 'Create process innovation data',
    description:
      'Creates process innovation data with innovation implementation documents file upload. File is stored in URN-specific folder (uploads/urns/{urn_no}/). Supports multiple file types: PNG, JPEG, PDF, Word, and Excel files. Document metadata is stored in the master all_product_documents table.',
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
        innovationImplementationDetails: {
          type: 'string',
          description: 'Innovation implementation details (text)',
          example: 'Innovation implementation details',
        },
        processInnovationStatus: {
          type: 'number',
          description: 'Process innovation status (0=Pending, 1=Completed)',
          example: 0,
          enum: [0, 1],
        },
        innovationImplementationDocumentsFileName: {
          type: 'string',
          description:
            'Innovation implementation documents display name (required if uploading innovationImplementationDocumentsFile)',
          example: 'Innovation Implementation Documents - March 2026',
        },
        innovationImplementationDocumentsFile: {
          type: 'string',
          format: 'binary',
          description: 'Innovation implementation documents file',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Process innovation created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            processInnovationId: { type: 'number' },
            vendorId: { type: 'string' },
            urnNo: { type: 'string' },
            innovationImplementationDetails: { type: 'string' },
            innovationImplementationDocuments: { type: 'number' },
            processInnovationStatus: { type: 'number' },
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
    @UploadedFile() innovationImplementationDocumentsFile?: Express.Multer.File,
  ) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');

    const dto: CreateProcessInnovationDto = {
      urnNo: body.urnNo,
      innovationImplementationDetails: body.innovationImplementationDetails,
      processInnovationStatus: body.processInnovationStatus
        ? parseInt(body.processInnovationStatus, 10)
        : undefined,
      innovationImplementationDocumentsFileName:
        body.innovationImplementationDocumentsFileName,
    };

    // Validate file name if file is uploaded
    if (
      innovationImplementationDocumentsFile &&
      (!dto.innovationImplementationDocumentsFileName ||
        dto.innovationImplementationDocumentsFileName.trim() === '')
    ) {
      throw new BadRequestException(
        'innovationImplementationDocumentsFileName is required when uploading innovationImplementationDocumentsFile',
      );
    }

    const data = await this.processInnovationService.createProcessInnovation(
      dto,
      user.vendorId,
      innovationImplementationDocumentsFile,
    );
    return { success: true, data };
  }
}
