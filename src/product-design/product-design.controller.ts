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
import { productDesignMultipartMemoryMulterOptions } from '../common/upload/multer-universal.config';
import {
  assertSupportingDesignFileTypes,
  collectProductDesignUploadFiles,
  hasAtLeastOneProductDesignFieldFilled,
  parseMultipartJsonIdArray,
  parseMultipartNonNegativeInt,
} from './product-design-upload.util';
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
    AnyFilesInterceptor(productDesignMultipartMemoryMulterOptions(40)),
  )
  @ApiOperation({
    summary: 'Create or update product design data',
    description:
      'Saves product design for a URN. All content fields are **optional** individually; at least one of **strategies**, **measuresAndBenefits** (non-empty row), **ecoVisionFile**, or **supportingDesignFile** is required (vendor also enforces in UI). ' +
      '**measuresAndBenefits** replaces all measure rows (send the full list). **supportingDesignFile** = PDF/Excel only. ' +
      '**existingEcoVisionDocumentIds** / **existingSupportingDocumentIds** retain prior uploads on text-only saves.',
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
        strategies: {
          type: 'string',
          description:
            'Strategies text (optional). Eco-vision, supporting docs, and measures are also optional.',
          example: 'Product design strategies and approach',
        },
        statergies: {
          type: 'string',
          description: 'Legacy alias for strategies',
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
            'JSON array — **replaces** all measures for this URN. Format: [{"measuresImplemented":"...","benefitsAchieved":"..."}]',
          example:
            '[{"measuresImplemented":"Use of renewable energy","benefitsAchieved":"Reduced carbon footprint"}]',
        },
        ecoVisionFile: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description:
            'Eco vision file(s), optional. Repeat per file → eco_vision_upload (max 20).',
        },
        supportingDesignFile: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description:
            'Supporting design file(s), optional. PDF/Excel only (.pdf, .xls, .xlsx). Max 20.',
        },
        ecoVisionFilesCount: {
          type: 'number',
          description: 'Legacy `files`: count of leading eco-vision parts',
          example: 2,
        },
        supportingDesignFilesCount: {
          type: 'number',
          description: 'Legacy `files`: supporting parts after eco (optional hint)',
          example: 1,
        },
        existingEcoVisionDocumentIds: {
          type: 'string',
          description:
            'JSON array of productDocumentId (or _id) to keep for eco vision. Omit = keep all; [] = remove all not re-uploaded.',
          example: '[168,166]',
        },
        existingSupportingDocumentIds: {
          type: 'string',
          description:
            'JSON array of productDocumentId (or _id) to keep for supporting docs.',
          example: '[169,167]',
        },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description:
            'Legacy: eco parts first (ecoVisionFilesCount), then supporting.',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product design saved successfully',
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
              measuresAndBenefits = [];
            }
          }
        } else if (typeof rawMeasures === 'object') {
          measuresAndBenefits = [rawMeasures as MeasureBenefitDto];
        }
      }

      const strategiesRaw =
        body.strategies !== undefined && body.strategies !== null
          ? String(body.strategies)
          : body.statergies !== undefined && body.statergies !== null
            ? String(body.statergies)
            : undefined;

      const createProductDesignDto: CreateProductDesignDto = {
        urnNo: body.urnNo,
        strategies: strategiesRaw,
        statergies: strategiesRaw,
        productDesignStatus:
          body.productDesignStatus !== undefined &&
          body.productDesignStatus !== null &&
          body.productDesignStatus !== ''
            ? parseInt(String(body.productDesignStatus), 10)
            : undefined,
        measuresAndBenefits,
        existingEcoVisionDocumentIds: parseMultipartJsonIdArray(
          body.existingEcoVisionDocumentIds,
        ),
        existingSupportingDocumentIds: parseMultipartJsonIdArray(
          body.existingSupportingDocumentIds,
        ),
      };

      if (!createProductDesignDto.urnNo?.trim()) {
        throw new BadRequestException('URN number is required');
      }

      const { ecoVisionFiles, supportingDocumentFiles } =
        collectProductDesignUploadFiles(files, {
          ecoVisionFilesCount: parseMultipartNonNegativeInt(
            body.ecoVisionFilesCount,
          ),
          supportingDesignFilesCount: parseMultipartNonNegativeInt(
            body.supportingDesignFilesCount,
          ),
        });

      assertSupportingDesignFileTypes(supportingDocumentFiles);

      if (
        !hasAtLeastOneProductDesignFieldFilled({
          strategies: strategiesRaw,
          measuresAndBenefits,
          ecoVisionFiles,
          supportingDocumentFiles,
        })
      ) {
        throw new BadRequestException(
          'At least one Product Design field is required.',
        );
      }

      const result = await this.productDesignService.createProductDesign(
        createProductDesignDto,
        user.vendorId,
        { ecoVisionFiles, supportingDocumentFiles },
      );

      const plain =
        typeof result.productDesign.toObject === 'function'
          ? result.productDesign.toObject()
          : result.productDesign;
      const strategiesText = String(plain.statergies ?? '').trim();

      return {
        success: true,
        message: 'Product design saved successfully',
        data: {
          ...plain,
          strategies: strategiesText,
          statergies: strategiesText,
          measuresAndBenefits: result.measuresAndBenefits.map((row) => ({
            _id: row._id,
            productDesignMeasureId: row.productDesignMeasureId,
            measuresImplemented: row.measuresImplemented,
            benefitsAchieved: row.benefitsAchieved,
          })),
          ecoVisionUpload: result.ecoVisionDocumentCount,
          productDesignSupportingDocument: result.supportingDocumentCount,
        },
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}

