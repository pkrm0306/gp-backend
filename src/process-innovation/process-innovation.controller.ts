import {
  Controller,
  Post,
  Patch,
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
import { PatchInnovationDocumentTagDto } from './dto/patch-innovation-document-tag.dto';
import { parseInnovationDocumentTagsForUpload } from './utils/innovation-document-tag.util';

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
      'Creates or updates process innovation data with supporting documents. Files under uploads/urns/{urn_no}/. ' +
      'Optional **innovationDocumentTags**: JSON array string (same order as files), e.g. `["tech","process","social"]`. ' +
      'Omitted or short arrays default missing slots to **tech**. New rows append to `all_product_documents` (existing innovation docs are not removed).',
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
        innovationDocumentTags: {
          type: 'string',
          description:
            'JSON array of tags **tech** | **process** | **social**, one per file in upload order. Example: `["tech","process"]`. Optional; defaults to tech.',
          example: '["tech","process","social"]',
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

    const innovationImplementationDocumentsFiles = (files || []).filter(
      (f) => f.fieldname === 'innovationImplementationDocumentsFile',
    );

    const innovationDocumentTags = parseInnovationDocumentTagsForUpload(
      body.innovationDocumentTags ?? body.innovationDocumentTagsJson,
      innovationImplementationDocumentsFiles.length,
    );

    const dto: CreateProcessInnovationDto = {
      urnNo: body.urnNo,
      innovationImplementationDetails: body.innovationImplementationDetails,
      processInnovationStatus: body.processInnovationStatus
        ? parseInt(body.processInnovationStatus, 10)
        : undefined,
      innovationImplementationDocumentsFileName:
        body.innovationImplementationDocumentsFileName,
      innovationDocumentTags:
        innovationImplementationDocumentsFiles.length > 0
          ? innovationDocumentTags
          : undefined,
    };

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
      innovationDocumentTags,
    );
    return { success: true, data };
  }

  @Patch('document-tag')
  @ApiOperation({
    summary: 'Update tag on one innovation supporting document',
    description:
      'Sets **documentTag** (`tech` | `process` | `social`) on a row in `all_product_documents` for this vendor and URN. ' +
      'Use **productDocumentId** from `process_innovation_documents` in URN details.',
  })
  @ApiBody({ type: PatchInnovationDocumentTagDto })
  @ApiResponse({ status: 200, description: 'Tag updated' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async patchDocumentTag(
    @CurrentUser() user: any,
    @Body() body: PatchInnovationDocumentTagDto,
  ) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');
    const data =
      await this.processInnovationService.patchInnovationDocumentTag(
        body,
        user.vendorId,
      );
    return { success: true, data };
  }
}
