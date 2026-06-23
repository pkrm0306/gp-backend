import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { ProductRegistrationService } from './product-registration.service';
import { buildVendorProductListPagination } from './helpers/vendor-product-list-pagination.util';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  RegisterProductDto,
  BulkRegisterProductDto,
} from './dto/register-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsDto } from './dto/list-products.dto';

@ApiTags('Product Registration')
@ApiExtraModels(ListProductsDto)
@Controller('product-registration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductRegistrationController {
  constructor(
    private readonly productRegistrationService: ProductRegistrationService,
  ) {}

  @Get('list/filter-options')
  @ApiOperation({
    summary: 'Vendor uncertified EOI list — filter options',
    description:
      'Returns **all countries** for a dropdown (`data.countries[]`, sorted A–Z). Not limited to countries with products. ' +
      'Alternative: `GET /countries/dropdown`. **State** and **city** are free-text filters on `GET /product-registration/list`.',
  })
  @ApiResponse({
    status: 200,
    description: 'Filter options retrieved successfully',
  })
  async vendorListFilterOptions() {
    return this.productRegistrationService.vendorGetUncertifiedListFilterOptions();
  }

  @Get('list')
  @ApiOperation({
    summary: 'Vendor EOI list grouped by URN',
    description:
      'Returns paginated URN groups (not flat products). Each group includes nested **eois[]** with **EOI `productStatus`** and **statusLabel** (Pending / Submitted / …). ' +
      '**Default filter:** **Pending (0) + Submitted (1)** only (uncertified queue). Override with **`productStatusList`** (e.g. `0,1` or `3`) or a single **`productStatus`** / **`status`**. ' +
      '**Location filters:** `countryId` (dropdown id), `state` / `state_name` (text), `city` (text) — match any manufacturing plant on the EOI. ' +
      'Pagination counts URNs. When search matches any EOI in a URN, the full **eois[]** for that URN is returned (same filters).',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 20)',
    example: 20,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Global search term (searches in product_name, eoi_no, urn_no, category.category_name)',
    example: 'Solar Panel',
  })
  @ApiQuery({
    name: 'productStatus',
    required: false,
    type: Number,
    description:
      'Single EOI **productStatus** filter (0–4). If omitted and `productStatusList` is omitted, server defaults to **0 + 1** (Pending + Submitted).',
    example: 0,
    enum: [0, 1, 2, 3, 4],
  })
  @ApiQuery({
    name: 'productStatusList',
    required: false,
    type: String,
    description:
      'Multiple EOI **productStatus** values: comma-separated or repeated param, e.g. **`0,1`**. Takes precedence over `productStatus` / `status` when set.',
    example: '0,1',
  })
  @ApiQuery({
    name: 'product_status_list',
    required: false,
    type: String,
    description: 'Snake_case alias of `productStatusList`.',
    example: '0,1',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Number,
    description: 'Deprecated alias for `productStatus`',
    example: 0,
    enum: [0, 1, 2, 3, 4],
    deprecated: true,
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Filter by category ObjectId',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    description: 'Created date from (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    description: 'Created date to (YYYY-MM-DD)',
    example: '2026-12-31',
  })
  @ApiQuery({
    name: 'countryId',
    required: false,
    type: String,
    description:
      'Filter by plant country MongoDB `_id` (from `GET /product-registration/list/filter-options` or `GET /countries`).',
  })
  @ApiQuery({
    name: 'state',
    required: false,
    type: String,
    description:
      'Filter by plant state **name** (free text, partial match). Do not send state ObjectId.',
    example: 'Telangana',
  })
  @ApiQuery({
    name: 'state_name',
    required: false,
    type: String,
    description: 'Snake_case alias of `state` (text).',
    example: 'Telangana',
  })
  @ApiQuery({
    name: 'city',
    required: false,
    type: String,
    description: 'Filter by plant city (free text, partial match).',
    example: 'Hyderabad',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'URN sort by earliest product createdDate (default: desc)',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'EOI list fetched successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'EOI list fetched successfully' },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  urnNo: { type: 'string', example: 'URN-20260514165917' },
                  createdDate: {
                    type: 'string',
                    format: 'date-time',
                  },
                  urnStatus: {
                    type: 'string',
                    enum: ['Active', 'Pending', 'Inactive'],
                  },
                  totalEoi: { type: 'number', example: 3 },
                  eois: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        _id: { type: 'string' },
                        eoiNo: { type: 'string', example: 'GPPMI003012' },
                        productName: { type: 'string' },
                        categoryName: { type: 'string' },
                        productStatus: { type: 'number', example: 0 },
                        statusLabel: { type: 'string', example: 'Pending' },
                        createdDate: { type: 'string', format: 'date-time' },
                        hpUnits: { type: 'number', example: 5 },
                        plantCount: { type: 'number', example: 5 },
                        city: {
                          type: 'string',
                          nullable: true,
                          example: 'Hyderabad',
                          description: 'City from the first manufacturing plant (by createdDate) for this EOI.',
                        },
                        stateName: {
                          type: 'string',
                          nullable: true,
                          example: 'Telangana',
                          description: 'State name from the first plant, resolved via `states` collection.',
                        },
                        sector: {
                          type: 'number',
                          nullable: true,
                          example: 1,
                          description: 'Sector id from the product category (`categories.sector`).',
                        },
                        sectorName: {
                          type: 'string',
                          nullable: true,
                          example: 'Building Materials',
                          description: 'Sector label from `sectors` when `sector` matches `sectors.id`.',
                        },
                      },
                    },
                  },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
                totalCount: { type: 'number', example: 8 },
                totalPages: { type: 'number', example: 1 },
              },
            },
          },
        },
      },
    },
  })
  async listProducts(
    @CurrentUser() user: any,
    @Query() listProductsDto: ListProductsDto,
  ) {
    try {
      if (!user?.manufacturerId) {
        throw new BadRequestException('Manufacturer ID not found in token');
      }

      const result = await this.productRegistrationService.listProducts(
        listProductsDto,
        user.manufacturerId,
      );
      const pagination =
        result?.pagination ??
        buildVendorProductListPagination({
          page: listProductsDto.page ?? 1,
          limit: listProductsDto.limit ?? 20,
          totalCount: 0,
        });
      return {
        message: 'EOI list fetched successfully',
        data: result ?? {
          data: [],
          pagination,
        },
        pagination,
        totalCount: pagination.totalCount,
        totalPages: pagination.totalPages,
        page: pagination.page,
        limit: pagination.limit,
        currentPage: pagination.currentPage,
        hasMore: pagination.hasMore,
        isLastPage: pagination.isLastPage,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Post('single')
  @ApiOperation({
    summary: 'Register a single product',
    description:
      'Registers a single product with its plants. Generates URN and EOI automatically. Manufacturer is resolved from logged-in user.',
  })
  @ApiBody({ type: RegisterProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product registered successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: {
          type: 'string',
          example: 'Product(s) registered successfully',
        },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            productId: { type: 'number' },
            productName: { type: 'string' },
            eoiNo: { type: 'string' },
            urnNo: { type: 'string' },
            plants: { type: 'array' },
          },
        },
      },
    },
  })
  async registerSingleProduct(
    @CurrentUser() user: any,
    @Body() registerProductDto: RegisterProductDto,
  ) {
    try {
      const manufacturerId = user?.manufacturerId;
      if (!manufacturerId) {
        throw new BadRequestException('Manufacturer ID not found in token');
      }

      const result = await this.productRegistrationService.registerProduct(
        registerProductDto,
        manufacturerId,
      );

      return {
        status: 'success',
        message: 'Product(s) registered successfully',
        data: result,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Register multiple products (bulk)',
    description:
      'Registers multiple products in a single request. All products share the same URN, but each gets a unique EOI.',
  })
  @ApiBody({ type: BulkRegisterProductDto })
  @ApiResponse({
    status: 201,
    description: 'Products registered successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: {
          type: 'string',
          example: 'Product(s) registered successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              productId: { type: 'number' },
              productName: { type: 'string' },
              eoiNo: { type: 'string' },
              urnNo: { type: 'string' },
              plants: { type: 'array' },
            },
          },
        },
      },
    },
  })
  async registerBulkProducts(
    @CurrentUser() user: any,
    @Body() bulkRegisterProductDto: BulkRegisterProductDto,
  ) {
    try {
      if (bulkRegisterProductDto.products.length === 0) {
        throw new BadRequestException('At least one product is required');
      }

      const manufacturerId = user?.manufacturerId;
      if (!manufacturerId) {
        throw new BadRequestException('Manufacturer ID not found in token');
      }

      // Optional guard for backward compatibility: if manufacturerId is sent in payload, it must match JWT
      for (const product of bulkRegisterProductDto.products) {
        if (
          product.manufacturerId &&
          product.manufacturerId !== manufacturerId
        ) {
          throw new BadRequestException(
            'Payload manufacturerId must match logged-in manufacturer',
          );
        }
      }

      const results =
        await this.productRegistrationService.registerBulkProducts(
          bulkRegisterProductDto,
          manufacturerId,
        );

      return {
        status: 'success',
        message: 'Product(s) registered successfully',
        data: results,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a product in place (admin EOI edit)',
    description:
      'Updates the existing product row only — URN and EOI are never regenerated. ' +
      'Requires productName, productDetails, urnNo, and eoiNo; urnNo/eoiNo must match the product for {id} (400 on mismatch). ' +
      'Optional categoryId updates the product and all active product plants for that product. ' +
      'Category change resets all raw materials data for the URN and invalidates admin/vendor product list caches (`listRefreshRequired` in response). ' +
      'Category change is blocked when productStatus is certified (2), urnStatus >= 6 (after final review submission), or URN is in renewal (12–17). ' +
      'Other fields remain optional.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Product updated successfully' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            productId: { type: 'number' },
            productName: { type: 'string' },
            productImage: { type: 'string' },
            productDetails: { type: 'string' },
            productType: { type: 'number' },
            productStatus: { type: 'number' },
            productRenewStatus: { type: 'number' },
            urnStatus: { type: 'number' },
            assessmentReportUrl: { type: 'string' },
            rejectedDetails: { type: 'string' },
            certifiedDate: { type: 'string', format: 'date-time' },
            validtillDate: { type: 'string', format: 'date-time' },
            firstNotifyDate: { type: 'string', format: 'date-time' },
            secondNotifyDate: { type: 'string', format: 'date-time' },
            thirdNotifyDate: { type: 'string', format: 'date-time' },
            renewedDate: { type: 'string', format: 'date-time' },
            eoiNo: { type: 'string' },
            urnNo: { type: 'string' },
            createdDate: { type: 'string', format: 'date-time' },
            updatedDate: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({
    status: 400,
    description: 'Invalid product ID or duplicate URN/EOI',
  })
  async updateProduct(
    @CurrentUser() user: any,
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const result = await this.productRegistrationService.updateProduct(
        productId,
        updateProductDto,
      );

      return {
        status: 'success',
        message: 'Product updated successfully',
        data: result,
      };
    } catch (error: any) {
      console.error('Controller error:', error);
      throw error;
    }
  }
}
