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
import { ProductPerformanceService } from './product-performance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProductPerformanceDto } from './dto/create-product-performance.dto';
import * as fs from 'fs';

// Configure storage for product performance documents
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

@ApiTags('Product Performance')
@Controller('product-performance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductPerformanceController {
  constructor(
    private readonly productPerformanceService: ProductPerformanceService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('testReportFile', {
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
    summary: 'Create product performance data',
    description:
      'Creates product performance data with test report file upload. File is stored in URN-specific folder (uploads/urns/{urn_no}/). Supports multiple file types: PNG, JPEG, PDF, Word, and Excel files. Document metadata is stored in the master all_product_documents table.',
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
        eoiNo: {
          type: 'string',
          description: 'EOI number',
          example: 'EOI-20260305124230',
        },
        productName: {
          type: 'string',
          description: 'Product name',
          example: 'Solar Panel 100W',
        },
        testReportFileName: {
          type: 'string',
          description:
            'Test report display name (required if uploading testReportFile). This is a user-provided label.',
          example: 'IEC Test Report - March 2026',
        },
        renewalType: {
          type: 'number',
          description: 'Renewal type (0=Not Renewed, >0 = Renewed no of times)',
          example: 0,
          minimum: 0,
        },
        productPerformanceStatus: {
          type: 'number',
          description: 'Product performance status (0=Pending, 1=Completed)',
          example: 0,
          enum: [0, 1],
        },
        testReportFile: {
          type: 'string',
          format: 'binary',
          description: 'Test report file',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product performance created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Product performance created successfully',
        },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            processProductPerformanceId: { type: 'number' },
            urnNo: { type: 'string' },
            eoiNo: { type: 'string' },
            productName: { type: 'string' },
            testReportFileName: {
              type: 'string',
              description: 'Stored test report file name',
            },
            testReportFiles: { type: 'number', example: 1 },
            renewalType: { type: 'number', example: 0 },
            productPerformanceStatus: { type: 'number', example: 0 },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid data or file format' })
  async createProductPerformance(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFile() testReportFile?: Express.Multer.File,
  ) {
    try {
      if (!user?.vendorId) {
        throw new BadRequestException('Vendor ID not found in token');
      }

      // Parse form data
      const createProductPerformanceDto: CreateProductPerformanceDto = {
        urnNo: body.urnNo,
        eoiNo: body.eoiNo,
        productName: body.productName,
        testReportFileName: body.testReportFileName,
        renewalType: body.renewalType ? parseInt(body.renewalType) : undefined,
        productPerformanceStatus: body.productPerformanceStatus
          ? parseInt(body.productPerformanceStatus)
          : undefined,
      };

      // Validate mandatory fields
      if (!createProductPerformanceDto.urnNo) {
        throw new BadRequestException('URN number is required');
      }

      // If file is uploaded, require a display name
      if (
        testReportFile &&
        (!createProductPerformanceDto.testReportFileName ||
          createProductPerformanceDto.testReportFileName.trim() === '')
      ) {
        throw new BadRequestException(
          'testReportFileName is required when uploading testReportFile',
        );
      }

      const productPerformance =
        await this.productPerformanceService.createProductPerformance(
          createProductPerformanceDto,
          user.vendorId,
          testReportFile,
        );

      return {
        success: true,
        message: 'Product performance created successfully',
        data: productPerformance,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}
