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
import { ProcessLifeCycleApproachService } from './process-life-cycle-approach.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessLifeCycleApproachDto } from './dto/create-process-life-cycle-approach.dto';

@ApiTags('Process Life Cycle Approach')
@Controller('process-life-cycle-approach')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessLifeCycleApproachController {
  constructor(
    private readonly processLifeCycleApproachService: ProcessLifeCycleApproachService,
  ) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor(certificationMultipartMemoryMulterOptions()),
  )
  @ApiOperation({
    summary: 'Create process life cycle approach data',
    description:
      'Creates process life cycle approach data with file uploads. Files are stored in URN-specific folder (uploads/urns/{urn_no}/). Only PDF and Excel (.pdf, .xls, .xlsx) uploads are allowed.',
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
          description:
            'Process life cycle approach status (0=Pending, 1=Completed)',
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
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Life cycle assessment reports files (multiple supported)',
        },
        lifeCycleImplementationDocumentsFile: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description:
            'Life cycle implementation documents files (multiple supported)',
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
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');

    // Parse body to get DTO
    const dto: CreateProcessLifeCycleApproachDto = {
      urnNo: body.urnNo,
      lifeCycleImplementationDetails: body.lifeCycleImplementationDetails,
      processLifeCycleApproachStatus: body.processLifeCycleApproachStatus
        ? parseInt(body.processLifeCycleApproachStatus, 10)
        : undefined,
      lifeCycleAssesmentReportsFileName: body.lifeCycleAssesmentReportsFileName,
      lifeCycleImplementationDocumentsFileName:
        body.lifeCycleImplementationDocumentsFileName,
    };

    // Extract files by fieldname from the files array
    // AnyFilesInterceptor captures all files and stores them with their fieldname
    const lifeCycleAssesmentReportsFiles = (files || []).filter(
      (f) => f.fieldname === 'lifeCycleAssesmentReportsFile',
    );
    const lifeCycleImplementationDocumentsFiles = (files || []).filter(
      (f) => f.fieldname === 'lifeCycleImplementationDocumentsFile',
    );

    // Validate file names if files are uploaded
    if (
      lifeCycleAssesmentReportsFiles.length > 0 &&
      (!dto.lifeCycleAssesmentReportsFileName ||
        dto.lifeCycleAssesmentReportsFileName.trim() === '')
    ) {
      throw new BadRequestException(
        'lifeCycleAssesmentReportsFileName is required when uploading lifeCycleAssesmentReportsFile',
      );
    }

    if (
      lifeCycleImplementationDocumentsFiles.length > 0 &&
      (!dto.lifeCycleImplementationDocumentsFileName ||
        dto.lifeCycleImplementationDocumentsFileName.trim() === '')
    ) {
      throw new BadRequestException(
        'lifeCycleImplementationDocumentsFileName is required when uploading lifeCycleImplementationDocumentsFile',
      );
    }

    const data =
      await this.processLifeCycleApproachService.createProcessLifeCycleApproach(
        dto,
        user.vendorId,
        lifeCycleAssesmentReportsFiles,
        lifeCycleImplementationDocumentsFiles,
      );
    return { success: true, data };
  }
}
