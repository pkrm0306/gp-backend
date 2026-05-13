import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { certificationMultipartMemoryMulterOptions } from '../common/upload/multer-universal.config';
import { ProductDesignService } from './product-design.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProductDesignDto } from './dto/create-product-design.dto';
import { MeasureBenefitDto } from './dto/measure-benefit.dto';

@ApiTags('Product Design')
@Controller('product-design')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductDesignController {
  constructor(private readonly productDesignService: ProductDesignService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 20, certificationMultipartMemoryMulterOptions()),
  )
  @ApiOperation({
    summary: 'Create product design data',
    description:
      'Creates product design data with file uploads. Files are stored in URN-specific folders (uploads/urns/{urn_no}/). Supports multiple file types: PNG, JPEG, PDF, Word, and Excel files.',
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
        statergies: {
          type: 'string',
          description: 'Strategies (text field)',
          example: 'Product design strategies and approach',
        },
        productDesignStatus: {
          type: 'number',
          description: 'Product design status (0=Pending, 1=Completed)',
          example: 0,
          enum: [0, 1],
        },
        measuresAndBenefits: {
          type: 'string',
          description:
            'JSON array of measures and benefits. Format: [{"measuresImplemented":"...","benefitsAchieved":"..."}]',
          example:
            '[{"measuresImplemented":"Use of renewable energy","benefitsAchieved":"Reduced carbon footprint"}]',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description:
            'Upload multiple files. First file is treated as eco_vision_upload and remaining files are treated as product_design_supporting_document.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product design created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Product design created successfully',
        },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            productDesignId: { type: 'number' },
            urnNo: { type: 'string' },
            ecoVisionUpload: { type: 'number', example: 1 },
            productDesignSupportingDocument: { type: 'number', example: 1 },
            productDesignStatus: { type: 'number', example: 0 },
            measuresAndBenefits: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  measuresImplemented: { type: 'string' },
                  benefitsAchieved: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid data or file format' })
  async createProductDesign(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      if (!user?.vendorId) {
        throw new BadRequestException('Vendor ID not found in token');
      }

      // Parse measuresAndBenefits from multipart payload (lenient for re-submit/edit flows)
      let measuresAndBenefits: MeasureBenefitDto[] | undefined;
      const rawMeasures = body.measuresAndBenefits;
      if (rawMeasures !== undefined && rawMeasures !== null) {
        if (Array.isArray(rawMeasures)) {
          measuresAndBenefits = rawMeasures;
        } else if (typeof rawMeasures === 'string') {
          const trimmed = rawMeasures.trim();
          if (trimmed === '') {
            measuresAndBenefits = [];
          } else {
            try {
              const parsed = JSON.parse(trimmed);
              if (Array.isArray(parsed)) {
                measuresAndBenefits = parsed;
              } else if (parsed && typeof parsed === 'object') {
                measuresAndBenefits = [parsed as MeasureBenefitDto];
              } else {
                measuresAndBenefits = [];
              }
            } catch {
              // Do not block submit on malformed payload from client-side row edits.
              // Service layer will normalize and replace with empty/valid rows.
              measuresAndBenefits = [];
            }
          }
        } else if (typeof rawMeasures === 'object') {
          measuresAndBenefits = [rawMeasures as MeasureBenefitDto];
        }
      }

      // Parse form data
      const createProductDesignDto: CreateProductDesignDto = {
        urnNo: body.urnNo,
        statergies: body.statergies,
        productDesignStatus: body.productDesignStatus
          ? parseInt(body.productDesignStatus)
          : undefined,
        measuresAndBenefits,
      };

      // Validate mandatory fields
      if (!createProductDesignDto.urnNo) {
        throw new BadRequestException('URN number is required');
      }

      const result = await this.productDesignService.createProductDesign(
        createProductDesignDto,
        user.vendorId,
        files,
      );

      return {
        success: true,
        message: 'Product design created successfully',
        data: result.productDesign,
        meta: {
          measures: result.measureStats,
        },
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}
