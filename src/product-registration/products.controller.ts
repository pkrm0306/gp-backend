import {
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { ProductRegistrationService } from './product-registration.service';
import { UrnTabReviewService } from './urn-tab-review.service';
import { UpdateUrnStatusDto } from './dto/update-urn-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { VendorPatchCertifiedProductDto } from './dto/vendor-patch-certified-product.dto';
import { adminImageMemoryMulterOptions } from '../common/upload/multer-universal.config';
import { VendorCertificateService } from './services/vendor-certificate.service';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(
    private readonly productRegistrationService: ProductRegistrationService,
    private readonly urnTabReviewService: UrnTabReviewService,
    private readonly vendorCertificateService: VendorCertificateService,
  ) {}

  @Get('renew-list')
  @ApiOperation({
    summary: 'Get products eligible for renewal',
    description:
      'Returns a list of certified products (product_status = 2) for the logged-in manufacturer that are expiring within 60 days (validtill_date < current_date + 60 days). Products are joined with categories collection to get category_name. Results are sorted by created_date DESC.',
  })
  @ApiResponse({
    status: 200,
    description: 'Renew list retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              product_id: { type: 'number', example: 1 },
              eoi_no: { type: 'string', example: 'GPMN012001' },
              urn_no: { type: 'string', example: 'URN-20240302120000' },
              product_name: { type: 'string', example: 'Solar Panel 100W' },
              product_details: {
                type: 'string',
                example: 'High-efficiency monocrystalline panel',
              },
              unit_count: {
                type: 'number',
                description: 'Manufacturing unit / plant count for this EOI',
                example: 2,
              },
              category_name: { type: 'string', example: 'Solar Panels' },
              validtill_date: {
                type: 'string',
                format: 'date-time',
                example: '2024-05-15T10:30:00.000Z',
              },
              product_status: { type: 'number', example: 2 },
              created_date: {
                type: 'string',
                format: 'date-time',
                example: '2024-03-02T12:00:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Manufacturer ID not found in token',
  })
  async getRenewList(@CurrentUser() user: any) {
    try {
      if (!user?.manufacturerId) {
        throw new BadRequestException('Manufacturer ID not found in token');
      }

      const data = await this.productRegistrationService.getRenewList(
        user.manufacturerId,
      );

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Patch('certified/:productId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('productImage', adminImageMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Vendor edit certified product',
    description:
      'Vendor-only patch endpoint for certified list edit popup. Allows updating product name, description, and optional image for the logged-in vendor.',
  })
  @ApiParam({
    name: 'productId',
    description: 'MongoDB product document _id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productName: { type: 'string' },
        productDetails: { type: 'string' },
        productImage: {
          type: 'string',
          format: 'binary',
          description: 'Optional product image (JPEG, PNG, GIF, WebP)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Certified product updated' })
  @ApiResponse({
    status: 400,
    description: 'Not certified or no editable fields provided',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found for this vendor',
  })
  async vendorPatchCertifiedProduct(
    @CurrentUser() user: { manufacturerId?: string },
    @Param('productId') productId: string,
    @Body() dto: VendorPatchCertifiedProductDto,
    @UploadedFile() productImage?: Express.Multer.File,
  ) {
    if (!user?.manufacturerId) {
      throw new BadRequestException('Manufacturer ID not found in token');
    }

    const data = await this.productRegistrationService.vendorPatchCertifiedProduct(
      productId.trim(),
      dto,
      user.manufacturerId,
      productImage,
    );
    return {
      success: true,
      message: 'Certified product updated successfully',
      data,
    };
  }

  @Get('urn-tab-review/:urn_no')
  @ApiOperation({
    summary: 'Get vendor Save & Next guidance after admin resend',
    description:
      'When urnStatus is 5 (admin sent back for corrections), returns which process tabs and raw material steps may be saved. Only rejected sections have canSaveAndNext=true; approved sections are read-only on the vendor panel.',
  })
  @ApiParam({
    name: 'urn_no',
    description: 'URN number',
    example: 'URN-20240302120000',
  })
  @ApiResponse({ status: 200, description: 'Vendor tab review guidance' })
  @ApiResponse({ status: 404, description: 'URN not found for this vendor' })
  async getVendorUrnTabReviewGuidance(
    @CurrentUser() user: { manufacturerId?: string },
    @Param('urn_no') urnNo: string,
  ) {
    if (!user?.manufacturerId) {
      throw new BadRequestException('Manufacturer ID not found in token');
    }
    const data = await this.urnTabReviewService.getVendorUrnTabReviewGuidance(
      urnNo,
      user.manufacturerId,
    );
    return {
      success: true,
      message: 'Vendor URN tab review guidance retrieved',
      data,
    };
  }

  @Get('details/:urn_no')
  @ApiOperation({
    summary: 'Get complete product details by URN (vendor)',
    description:
      'Returns complete product details for all products with the specified URN, including categories, manufacturers, vendors, plants, payments, and **siteVisits** (admin-managed site visit locations for this URN). Each item in `data[]` also includes the same `siteVisits` array; top-level `siteVisits` / `site_visits` is provided for the URN process UI.',
  })
  @ApiParam({
    name: 'urn_no',
    description: 'URN number',
    example: 'URN-20240302120000',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Product details retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        siteVisits: {
          type: 'array',
          description: 'Site visit locations for this URN (read-only)',
        },
        site_visits: {
          type: 'array',
          description: 'Snake_case alias of siteVisits',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              siteVisits: {
                type: 'array',
                description: 'Same as top-level siteVisits',
              },
              product_details: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  productId: { type: 'number' },
                  eoiNo: { type: 'string' },
                  urnNo: { type: 'string' },
                  productName: { type: 'string' },
                  productImage: { type: 'string' },
                  plantCount: { type: 'number' },
                  productDetails: { type: 'string' },
                  productType: { type: 'number' },
                  productStatus: { type: 'number' },
                  productRenewStatus: { type: 'number' },
                  urnStatus: { type: 'number' },
                  createdDate: { type: 'string', format: 'date-time' },
                  updatedDate: { type: 'string', format: 'date-time' },
                },
              },
              category: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  categoryName: { type: 'string' },
                  categoryCode: { type: 'string' },
                },
                additionalProperties: true,
                description:
                  'Complete category document from categories collection (includes all available fields).',
              },
              manufacturer: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  manufacturerName: { type: 'string' },
                  gpInternalId: { type: 'string' },
                  manufacturerInitial: { type: 'string' },
                },
              },
              vendor: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  vendorName: { type: 'string' },
                  vendorEmail: { type: 'string' },
                  vendorPhone: { type: 'string' },
                },
              },
              plants: {
                type: 'array',
                items: { type: 'object' },
              },
              payments: {
                type: 'array',
                items: { type: 'object' },
              },
              product_design: {
                type: 'object',
                nullable: true,
                properties: {
                  _id: { type: 'string' },
                  productDesignId: { type: 'number' },
                  urnNo: { type: 'string' },
                  ecoVisionUpload: {
                    type: 'number',
                    description: '0=No File Available, 1=File Available',
                  },
                  statergies: {
                    type: 'string',
                    description: 'Product design strategies text (DB field name)',
                  },
                  strategies: {
                    type: 'string',
                    description: 'Same value as statergies (alias for clients)',
                  },
                  productDesignSupportingDocument: {
                    type: 'number',
                    description: '0=No File Available, 1=File Available',
                  },
                  productDesignStatus: {
                    type: 'number',
                    description: '0=Pending, 1=Completed',
                  },
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
                  createdDate: { type: 'string', format: 'date-time' },
                  updatedDate: { type: 'string', format: 'date-time' },
                },
              },
              product_performance: {
                type: 'object',
                nullable: true,
                properties: {
                  _id: { type: 'string' },
                  processProductPerformanceId: { type: 'number' },
                  urnNo: { type: 'string' },
                  eoiNo: { type: 'string' },
                  productName: { type: 'string' },
                  testReportFileName: { type: 'string' },
                  testReportFiles: {
                    type: 'number',
                    description: '0=No File Available, 1=File Available',
                  },
                  renewalType: {
                    type: 'number',
                    description: '0=Not Renewed, >0 = Renewed no of times',
                  },
                  productPerformanceStatus: {
                    type: 'number',
                    description: '0=Pending, 1=Completed',
                  },
                  createdDate: { type: 'string', format: 'date-time' },
                  updatedDate: { type: 'string', format: 'date-time' },
                },
              },
              product_performance_documents: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    productDocumentId: { type: 'number' },
                    documentForm: { type: 'string' },
                    documentFormSubsection: { type: 'string' },
                    documentName: { type: 'string' },
                    documentOriginalName: { type: 'string' },
                    documentLink: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No products found with the specified URN',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - URN number is required',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getProductDetailsByUrn(@Param('urn_no') urnNo: string) {
    try {
      if (!urnNo || urnNo.trim() === '') {
        throw new BadRequestException('URN number is required');
      }

      const data = await this.productRegistrationService.getProductDetailsByUrn(
        urnNo.trim(),
      );

      const siteVisits =
        (data[0] as { siteVisits?: unknown[] } | undefined)?.siteVisits ?? [];

      return {
        success: true,
        data,
        siteVisits,
        site_visits: siteVisits,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Patch('urn-status')
  @ApiOperation({
    summary: 'Update URN status',
    description:
      'Updates the URN status for a product matching the logged-in manufacturer and urnNo. Activity logging is automatically performed for the status change.',
  })
  @ApiResponse({
    status: 200,
    description: 'URN status updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            productId: { type: 'number' },
            vendorId: { type: 'string' },
            manufacturerId: { type: 'string' },
            urnNo: { type: 'string' },
            eoiNo: { type: 'string' },
            productName: { type: 'string' },
            urnStatus: {
              type: 'number',
              description: 'Updated URN status (0-11)',
            },
            productStatus: {
              type: 'number',
              description:
                'Updated product status when optional `productStatus` is sent in request body',
            },
            updatedDate: { type: 'string', format: 'date-time' },
          },
        },
        message: { type: 'string', example: 'URN status updated successfully' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found with the given manufacturer and urnNo',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async updateUrnStatus(
    @CurrentUser() user: any,
    @Body() updateUrnStatusDto: UpdateUrnStatusDto,
  ) {
    try {
      if (!user?.manufacturerId) {
        throw new BadRequestException('Manufacturer ID not found in token');
      }
      const data = await this.productRegistrationService.updateUrnStatus(
        updateUrnStatusDto,
        user.manufacturerId,
      );

      return {
        success: true,
        data: {
          _id: data._id,
          productId: data.productId,
          vendorId: data.vendorId,
          manufacturerId: data.manufacturerId,
          urnNo: data.urnNo,
          eoiNo: data.eoiNo,
          productName: data.productName,
          urnStatus: data.urnStatus,
          productStatus: data.productStatus,
          updatedDate: data.updatedDate,
        },
        message: 'URN status updated successfully',
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Get('certificates/eoi/:productId')
  @ApiOperation({
    summary: 'Download certified product certificate (single EOI)',
    description:
      'Vendor-only. Downloads the GreenPro certificate PDF for one certified product (`productStatus = 2`) owned by the logged-in manufacturer.',
  })
  @ApiParam({
    name: 'productId',
    description: 'MongoDB product document _id from certified list',
  })
  @ApiResponse({ status: 200, description: 'Certificate PDF download' })
  @ApiResponse({ status: 404, description: 'Certified product not found' })
  async downloadEoiCertificate(
    @CurrentUser() user: { manufacturerId?: string },
    @Param('productId') productId: string,
  ): Promise<StreamableFile> {
    if (!user?.manufacturerId) {
      throw new BadRequestException('Manufacturer ID not found in token');
    }
    const file = await this.vendorCertificateService.downloadEoiCertificate(
      user.manufacturerId,
      productId,
    );
    return new StreamableFile(file.buffer, {
      type: file.contentType,
      disposition: `attachment; filename="${file.fileName}"`,
    });
  }

  @Get('certificates/urn/:urnNo/download')
  @ApiOperation({
    summary: 'Download all certificates for a URN (single PDF)',
    description:
      'Vendor-only. Merges all certified EOI certificates under the given URN into one PDF file (certificates appended page-by-page).',
  })
  @ApiParam({
    name: 'urnNo',
    description: 'URN number',
    example: 'URN-20260527122016',
  })
  @ApiResponse({ status: 200, description: 'Merged certificate PDF download' })
  @ApiResponse({ status: 404, description: 'No certified certificates found' })
  async downloadUrnCertificatesPdf(
    @CurrentUser() user: { manufacturerId?: string },
    @Param('urnNo') urnNo: string,
  ): Promise<StreamableFile> {
    if (!user?.manufacturerId) {
      throw new BadRequestException('Manufacturer ID not found in token');
    }
    const file = await this.vendorCertificateService.downloadUrnCertificatesPdf(
      user.manufacturerId,
      urnNo,
    );
    return new StreamableFile(file.buffer, {
      type: file.contentType,
      disposition: `attachment; filename="${file.fileName}"`,
    });
  }
}
