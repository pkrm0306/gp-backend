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
import { wasteManagementMultipartMemoryMulterOptions } from '../common/upload/multer-universal.config';
import { ProcessWasteManagementService } from './process-waste-management.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessWasteManagementDto } from './dto/create-process-waste-management.dto';

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
    AnyFilesInterceptor(wasteManagementMultipartMemoryMulterOptions()),
  )
  @ApiOperation({
    summary: 'Create process waste management data',
    description:
      'Creates or updates process waste management data with supporting documents. Files are stored under uploads/urns/{urn_no}/. New uploads add rows in all_product_documents; existing documents for this URN are not removed automatically (same incremental behaviour as process manufacturing documents).',
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
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Waste management supporting documents files (multiple)',
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
    @UploadedFiles() files?: Express.Multer.File[],
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

    const wmSupportingDocumentsFiles = (files || []).filter(
      (f) => f.fieldname === 'wmSupportingDocumentsFile',
    );

    // Validate file name if file is uploaded
    if (
      wmSupportingDocumentsFiles.length > 0 &&
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
        wmSupportingDocumentsFiles,
      );
    return { success: true, data };
  }
}
