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

  @Get('list')
  @ApiOperation({
    summary: 'List all products',
    description:
      'Returns a paginated list of products with optional search, filtering by status, and sorting. Uses MongoDB aggregation with category lookup.',
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
    description: 'Number of items per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Global search term (searches in product_name, eoi_no, urn_no, category.category_name)',
    example: 'Solar Panel',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Number,
    description: 'Filter by product status (0=Pending, 1=Active, 2=Certified, 3=Rejected)',
    example: 0,
    enum: [0, 1, 2, 3],
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort order by created_date (default: desc)',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Products retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  eoiNo: { type: 'string', example: 'GPMN012001' },
                  urnNo: { type: 'string', example: 'URN-20240302120000' },
                  productName: { type: 'string', example: 'Solar Panel 100W' },
                  productDetails: { type: 'string', example: 'Product description details' },
                  addedOn: { type: 'string', format: 'date-time', example: '2024-03-02T12:00:00.000Z' },
                  category: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                      categoryName: { type: 'string', example: 'Solar Panels' },
                      categoryCode: { type: 'string', example: 'SOLAR' },
                    },
                  },
                  hpUnits: { type: 'number', example: 5 },
                  status: { type: 'number', example: 0 },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
                totalCount: { type: 'number', example: 50 },
                totalPages: { type: 'number', example: 5 },
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
      return {
        message: 'Products retrieved successfully',
        data: result,
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
        message: { type: 'string', example: 'Product(s) registered successfully' },
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
        message: { type: 'string', example: 'Product(s) registered successfully' },
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
        if (product.manufacturerId && product.manufacturerId !== manufacturerId) {
          throw new BadRequestException('Payload manufacturerId must match logged-in manufacturer');
        }
      }

      const results = await this.productRegistrationService.registerBulkProducts(
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
    summary: 'Update a product',
    description:
      'Updates a product with all updatable fields. If productName changes, a new URN and EOI will be generated automatically. Otherwise, existing URN and EOI are preserved. All fields are optional - only provided fields will be updated.',
  })
  @ApiParam({ name: 'id', description: 'Product ID', example: '507f1f77bcf86cd799439011' })
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
  @ApiResponse({ status: 400, description: 'Invalid product ID or duplicate URN/EOI' })
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
