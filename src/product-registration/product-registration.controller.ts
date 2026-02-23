import {
  Controller,
  Post,
  Put,
  Body,
  Param,
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
} from '@nestjs/swagger';
import { ProductRegistrationService } from './product-registration.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  RegisterProductDto,
  BulkRegisterProductDto,
} from './dto/register-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Product Registration')
@Controller('product-registration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductRegistrationController {
  constructor(
    private readonly productRegistrationService: ProductRegistrationService,
  ) {}

  @Post('single')
  @ApiOperation({
    summary: 'Register a single product',
    description:
      'Registers a single product with its plants. Generates URN and EOI automatically. Requires manufacturerId and vendorId in the request body.',
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
      // Use manufacturerId and vendorId from request body
      const manufacturerId = registerProductDto.manufacturerId;
      const vendorId = registerProductDto.vendorId;

      const result = await this.productRegistrationService.registerProduct(
        registerProductDto,
        vendorId,
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
      // Validate that all products have the same manufacturerId and vendorId
      if (bulkRegisterProductDto.products.length === 0) {
        throw new BadRequestException('At least one product is required');
      }

      // Get manufacturerId and vendorId from the first product (all should be the same)
      const manufacturerId = bulkRegisterProductDto.products[0].manufacturerId;
      const vendorId = bulkRegisterProductDto.products[0].vendorId;

      // Validate all products have the same manufacturerId and vendorId
      for (const product of bulkRegisterProductDto.products) {
        if (product.manufacturerId !== manufacturerId) {
          throw new BadRequestException('All products must have the same manufacturerId');
        }
        if (product.vendorId !== vendorId) {
          throw new BadRequestException('All products must have the same vendorId');
        }
      }

      const results = await this.productRegistrationService.registerBulkProducts(
        bulkRegisterProductDto,
        vendorId,
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
      'Updates a product. If productName changes, a new URN and EOI will be generated automatically. Otherwise, existing URN and EOI are preserved.',
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
            eoiNo: { type: 'string' },
            urnNo: { type: 'string' },
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
