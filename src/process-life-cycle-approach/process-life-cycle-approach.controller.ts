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
import { ProcessLifeCycleApproachService } from './process-life-cycle-approach.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessLifeCycleApproachDto } from './dto/create-process-life-cycle-approach.dto';

// Configure storage for process life cycle approach documents
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

@ApiTags('Process Life Cycle Approach')
@Controller('process-life-cycle-approach')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessLifeCycleApproachController {
  constructor(private readonly processLifeCycleApproachService: ProcessLifeCycleApproachService) {}

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
    summary: 'Create process life cycle approach data',
    description:
      'Creates process life cycle approach data with file uploads (life cycle assessment reports and life cycle implementation documents). Files are stored in URN-specific folder (uploads/urns/{urn_no}/). Supports multiple file types: PNG, JPEG, PDF, Word, and Excel files. Document metadata is stored in the master all_product_documents table.',
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
        lifeCycleImplementationDetails: {
          type: 'string',
          description: 'Life cycle implementation details (text)',
          example: 'Implementation details for life cycle approach',
        },
        processLifeCycleApproachStatus: {
          type: 'number',
          description: 'Process life cycle approach status (0=Pending, 1=Completed)',
          example: 0,
          enum: [0, 1],
        },
        lifeCycleAssesmentReportsFileName: {
          type: 'string',
          description:
            'Life cycle assessment reports display name (required if uploading lifeCycleAssesmentReportsFile)',
          example: 'Life Cycle Assessment Reports - March 2026',
        },
        lifeCycleImplementationDocumentsFileName: {
          type: 'string',
          description:
            'Life cycle implementation documents display name (required if uploading lifeCycleImplementationDocumentsFile)',
          example: 'Life Cycle Implementation Documents - March 2026',
        },
        lifeCycleAssesmentReportsFile: {
          type: 'string',
          format: 'binary',
          description: 'Life cycle assessment reports file',
        },
        lifeCycleImplementationDocumentsFile: {
          type: 'string',
          format: 'binary',
          description: 'Life cycle implementation documents file',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Process life cycle approach created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            processLifeCycleApproachId: { type: 'number' },
            vendorId: { type: 'string' },
            urnNo: { type: 'string' },
            lifeCycleAssesmentReports: { type: 'number' },
            lifeCycleImplementationDetails: { type: 'string' },
            lifeCycleImplementationDocuments: { type: 'number' },
            processLifeCycleApproachStatus: { type: 'number' },
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
    const dto: CreateProcessLifeCycleApproachDto = {
      urnNo: body.urnNo,
      lifeCycleImplementationDetails: body.lifeCycleImplementationDetails,
      processLifeCycleApproachStatus: body.processLifeCycleApproachStatus
        ? parseInt(body.processLifeCycleApproachStatus, 10)
        : undefined,
      lifeCycleAssesmentReportsFileName: body.lifeCycleAssesmentReportsFileName,
      lifeCycleImplementationDocumentsFileName: body.lifeCycleImplementationDocumentsFileName,
    };

    // Extract files by fieldname from the files array
    // AnyFilesInterceptor captures all files and stores them with their fieldname
    const lifeCycleAssesmentReportsFile = files?.find(
      (f) => f.fieldname === 'lifeCycleAssesmentReportsFile',
    );
    const lifeCycleImplementationDocumentsFile = files?.find(
      (f) => f.fieldname === 'lifeCycleImplementationDocumentsFile',
    );

    // Validate file names if files are uploaded
    if (lifeCycleAssesmentReportsFile && (!dto.lifeCycleAssesmentReportsFileName || dto.lifeCycleAssesmentReportsFileName.trim() === '')) {
      throw new BadRequestException(
        'lifeCycleAssesmentReportsFileName is required when uploading lifeCycleAssesmentReportsFile',
      );
    }

    if (lifeCycleImplementationDocumentsFile && (!dto.lifeCycleImplementationDocumentsFileName || dto.lifeCycleImplementationDocumentsFileName.trim() === '')) {
      throw new BadRequestException(
        'lifeCycleImplementationDocumentsFileName is required when uploading lifeCycleImplementationDocumentsFile',
      );
    }

    const data = await this.processLifeCycleApproachService.createProcessLifeCycleApproach(
      dto,
      user.vendorId,
      lifeCycleAssesmentReportsFile,
      lifeCycleImplementationDocumentsFile,
    );
    return { success: true, data };
  }
}
