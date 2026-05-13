import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
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
import { ProcessInnovationService } from './process-innovation.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessInnovationDto } from './dto/create-process-innovation.dto';

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
    AnyFilesInterceptor(certificationMultipartMemoryMulterOptions()),
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
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description:
            'Innovation implementation documents files (multiple supported)',
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
    @UploadedFiles() files?: Express.Multer.File[],
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

    const innovationImplementationDocumentsFiles = (files || []).filter(
      (f) => f.fieldname === 'innovationImplementationDocumentsFile',
    );

    // Validate file name if file is uploaded
    if (
      innovationImplementationDocumentsFiles.length > 0 &&
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
      innovationImplementationDocumentsFiles,
    );
    return { success: true, data };
  }
}
