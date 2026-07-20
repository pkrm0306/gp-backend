import {
  Controller,
  Delete,
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import { PRODUCTS_DELETE_ANY } from '../common/constants/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProductSoftDeleteService } from './services/product-soft-delete.service';

@ApiTags('Product')
@Controller('product')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ProductController {
  constructor(
    private readonly productSoftDeleteService: ProductSoftDeleteService,
  ) {}

  @Delete(':id')
  @AnyPermissions(...PRODUCTS_DELETE_ANY)
  @ApiOperation({
    summary: 'Soft delete EOI product and re-sequence manufacturer EOIs',
    description:
      'Soft-deletes the product and all related product plants. When the deleted product is uncertified (pending/submitted), remaining active EOIs (status 0/1/2) for the manufacturer are re-numbered 1..n. Uses a database transaction; rolls back on failure. ' +
      'Restricted to platform admin and staff users with products:delete permission.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product MongoDB ObjectId',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'EOI deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'EOI deleted successfully',
        },
        deleted_product_id: { type: 'string' },
        deleted_plant_count: { type: 'number', example: 3 },
        updated_sequence_count: { type: 'number', example: 12 },
        manufacturer_id: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid id or product already deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin/staff only or missing products:delete permission' })
  @ApiResponse({ status: 404, description: 'Product or manufacturer not found' })
  @ApiResponse({ status: 409, description: 'Concurrent delete in progress' })
  async softDeleteProduct(
    @Param('id') id: string,
    @CurrentUser() user: { userId?: string },
  ) {
    if (!user?.userId) {
      throw new BadRequestException('User ID not found in token');
    }

    return this.productSoftDeleteService.softDeleteProduct(id, user.userId);
  }
}
