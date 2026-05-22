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
import { productPerformanceMultipartMemoryMulterOptions } from '../common/upload/multer-universal.config';
import {
  collectProductPerformanceUploadFiles,
  hasAtLeastOneProductPerformanceFieldFilled,
  parseMultipartJsonIdArray,
} from './product-performance-upload.util';
import { ProductPerformanceService } from './product-performance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProductPerformanceDto } from './dto/create-product-performance.dto';
import { TestReportEntryDto } from './dto/test-report-entry.dto';

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
    AnyFilesInterceptor(productPerformanceMultipartMemoryMulterOptions(20)),
  )
  @ApiOperation({
    summary: 'Create or update product performance data',
    description:
      'Saves product performance for a URN. **testReports** and **files** are optional individually; at least one non-empty row or new file is required (vendor also enforces in UI). ' +
      '**testReports** replaces all rows (full list each save). Rows may have only productName or only testReportFileName filled. ' +
      '**files** — new uploads only (max 20). **existingDocumentIds** retains prior documents on text-only saves.',
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
        testReports: {
          type: 'string',
          description:
            'JSON array — **replaces** all test report rows (optional). At least one row or files required. Format: [{"productName":"...","testReportFileName":"..."}]',
          example:
            '[{"productName":"Solar Panel 100W","testReportFileName":"IEC Test Report - March 2026"}]',
        },
        existingDocumentIds: {
          type: 'string',
          description:
            'JSON array of productDocumentId (or _id) to keep. Omit = keep all; [] = remove unlisted.',
          example: '[201,202,203]',
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description:
            'New test report files, optional (repeat per file, max 20). Labels may be derived from filenames when testReports is empty.',
        },
        testReportFile: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Legacy alias for files',
        },
        testReportFileName: {
          type: 'string',
          description: 'Deprecated — use testReports[]',
        },
        productName: {
          type: 'string',
          description: 'Deprecated — use testReports[].productName',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product performance saved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid data or file format' })
  async createProductPerformance(
    @CurrentUser() user: Record<string, unknown>,
    @Body() body: Record<string, unknown>,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const vendorId = user?.vendorId ?? user?.manufacturerId;
      if (!vendorId) {
        throw new BadRequestException('Vendor ID not found in token');
      }

      let testReports: TestReportEntryDto[] | undefined;
      const rawReports = body.testReports;
      if (rawReports !== undefined && rawReports !== null) {
        if (Array.isArray(rawReports)) {
          testReports = rawReports as TestReportEntryDto[];
        } else if (typeof rawReports === 'string') {
          const trimmed = rawReports.trim();
          if (trimmed === '') {
            testReports = [];
          } else {
            try {
              const parsed = JSON.parse(trimmed);
              if (Array.isArray(parsed)) {
                testReports = parsed;
              } else if (parsed && typeof parsed === 'object') {
                testReports = [parsed as TestReportEntryDto];
              } else {
                testReports = [];
              }
            } catch {
              testReports = [];
            }
          }
        } else if (typeof rawReports === 'object') {
          testReports = [rawReports as TestReportEntryDto];
        }
      }

      const createProductPerformanceDto: CreateProductPerformanceDto = {
        urnNo: String(body.urnNo ?? ''),
        renewalType:
          body.renewalType !== undefined && body.renewalType !== ''
            ? parseInt(String(body.renewalType), 10)
            : undefined,
        productPerformanceStatus:
          body.productPerformanceStatus !== undefined &&
          body.productPerformanceStatus !== ''
            ? parseInt(String(body.productPerformanceStatus), 10)
            : undefined,
        testReports,
        testReportFileName:
          body.testReportFileName !== undefined
            ? String(body.testReportFileName)
            : undefined,
        productName:
          body.productName !== undefined ? String(body.productName) : undefined,
        existingDocumentIds: parseMultipartJsonIdArray(
          body.existingDocumentIds,
        ),
      };

      if (!createProductPerformanceDto.urnNo?.trim()) {
        throw new BadRequestException('URN number is required');
      }

      const uploadFiles = collectProductPerformanceUploadFiles(files);

      if (
        !hasAtLeastOneProductPerformanceFieldFilled({
          testReports,
          uploadedFiles: uploadFiles,
        })
      ) {
        throw new BadRequestException(
          'At least one Product Performance field is required.',
        );
      }

      const result =
        await this.productPerformanceService.createProductPerformance(
          createProductPerformanceDto,
          String(vendorId),
          uploadFiles,
        );

      const performancePlain =
        typeof result.productPerformance.toObject === 'function'
          ? result.productPerformance.toObject()
          : result.productPerformance;

      const testReportsResponse = result.savedTestReports.map((row) => ({
        _id: row._id,
        productPerformanceTestReportId: row.productPerformanceTestReportId,
        productName: row.productName,
        testReportFileName: row.testReportFileName,
      }));

      return {
        success: true,
        message: 'Product performance saved successfully',
        data: {
          ...performancePlain,
          testReports: testReportsResponse,
          testReportFiles: result.totalDocumentCount,
        },
        meta: {
          filesUploaded: result.filesUploaded,
          testReportFiles: result.totalDocumentCount,
          testReports: testReportsResponse,
        },
      };
    } catch (error: unknown) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}

