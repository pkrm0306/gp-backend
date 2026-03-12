import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProductRegistrationService } from './product-registration.service';
import { UpdateUrnStatusDto } from './dto/update-urn-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  constructor(
    private readonly productRegistrationService: ProductRegistrationService,
  ) {}

  @Get('renew-list')
  @ApiOperation({
    summary: 'Get products eligible for renewal',
    description:
      'Returns a list of certified products (product_status = 2) for the logged-in vendor that are expiring within 60 days (validtill_date < current_date + 60 days). Products are joined with categories collection to get category_name. Results are sorted by created_date DESC.',
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
              category_name: { type: 'string', example: 'Solar Panels' },
              validtill_date: { type: 'string', format: 'date-time', example: '2024-05-15T10:30:00.000Z' },
              product_status: { type: 'number', example: 2 },
              created_date: { type: 'string', format: 'date-time', example: '2024-03-02T12:00:00.000Z' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  @ApiResponse({ status: 400, description: 'Bad request - Vendor ID not found in token' })
  async getRenewList(@CurrentUser() user: any) {
    try {
      if (!user?.vendorId) {
        throw new BadRequestException('Vendor ID not found in token');
      }

      const data = await this.productRegistrationService.getRenewList(user.vendorId);

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Get('details/:urn_no')
  @ApiOperation({
    summary: 'Get complete product details by URN',
    description:
      'Returns complete product details for all products with the specified URN, including related data from categories, manufacturers, vendors, product plants, and payment details. Uses MongoDB aggregation pipeline with multiple $lookup operations.',
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
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
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
                  ecoVisionUpload: { type: 'number', description: '0=No File Available, 1=File Available' },
                  statergies: { type: 'string' },
                  productDesignSupportingDocument: { type: 'number', description: '0=No File Available, 1=File Available' },
                  productDesignStatus: { type: 'number', description: '0=Pending, 1=Completed' },
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
                  testReportFiles: { type: 'number', description: '0=No File Available, 1=File Available' },
                  renewalType: { type: 'number', description: '0=Not Renewed, >0 = Renewed no of times' },
                  productPerformanceStatus: { type: 'number', description: '0=Pending, 1=Completed' },
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
  @ApiResponse({ status: 404, description: 'No products found with the specified URN' })
  @ApiResponse({ status: 400, description: 'Bad request - URN number is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async getProductDetailsByUrn(@Param('urn_no') urnNo: string) {
    try {
      if (!urnNo || urnNo.trim() === '') {
        throw new BadRequestException('URN number is required');
      }

      const data = await this.productRegistrationService.getProductDetailsByUrn(urnNo.trim());

      return {
        success: true,
        data,
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
      'Updates the URN status for a product matching the given vendorId and urnNo. The products table will be updated where vendorId and urnNo match, setting urnStatus to the provided updateStatusTo value. Activity logging is automatically performed for the status change.',
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
            urnStatus: { type: 'number', description: 'Updated URN status (0-11)' },
            updatedDate: { type: 'string', format: 'date-time' },
          },
        },
        message: { type: 'string', example: 'URN status updated successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found with the given vendorId and urnNo' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async updateUrnStatus(@Body() updateUrnStatusDto: UpdateUrnStatusDto) {
    try {
      const data = await this.productRegistrationService.updateUrnStatus(updateUrnStatusDto);

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
          updatedDate: data.updatedDate,
        },
        message: 'URN status updated successfully',
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}
