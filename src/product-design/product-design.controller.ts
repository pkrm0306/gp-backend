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
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductDesignService } from './product-design.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProductDesignDto } from './dto/create-product-design.dto';
import { MeasureBenefitDto } from './dto/measure-benefit.dto';
import * as fs from 'fs';

// Configure storage for product design documents
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

@ApiTags('Product Design')
@Controller('product-design')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductDesignController {
  constructor(private readonly productDesignService: ProductDesignService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, {
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
          description: 'JSON array of measures and benefits. Format: [{"measuresImplemented":"...","benefitsAchieved":"..."}]',
          example: '[{"measuresImplemented":"Use of renewable energy","benefitsAchieved":"Reduced carbon footprint"}]',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files: First file is eco_vision_upload, second file is product_design_supporting_document',
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
        message: { type: 'string', example: 'Product design created successfully' },
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

      // Parse measuresAndBenefits from JSON string if provided
      let measuresAndBenefits: MeasureBenefitDto[] | undefined;
      if (body.measuresAndBenefits) {
        try {
          // If it's a string, parse it; if it's already an object/array, use it directly
          if (typeof body.measuresAndBenefits === 'string') {
            measuresAndBenefits = JSON.parse(body.measuresAndBenefits);
          } else if (Array.isArray(body.measuresAndBenefits)) {
            measuresAndBenefits = body.measuresAndBenefits;
          }
        } catch (parseError) {
          throw new BadRequestException('Invalid measuresAndBenefits format. Expected JSON array.');
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

      // Extract files (first file = eco_vision, second file = supporting_document)
      const ecoVisionFile = files && files.length > 0 ? files[0] : undefined;
      const supportingDocumentFile = files && files.length > 1 ? files[1] : undefined;

      const productDesign = await this.productDesignService.createProductDesign(
        createProductDesignDto,
        user.vendorId,
        ecoVisionFile,
        supportingDocumentFile,
      );

      return {
        success: true,
        message: 'Product design created successfully',
        data: productDesign,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}
