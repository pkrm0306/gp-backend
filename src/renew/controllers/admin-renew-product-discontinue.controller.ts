import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminRenewProductDiscontinueService } from '../services/admin-renew-product-discontinue.service';
import { ToggleProductStatusBodyDto, BulkReactivateProductsBodyDto } from '../dto/admin-product-discontinue.dto';

@ApiTags('Admin Renewals')
@Controller('api/admin/renewals/:urnNo/product-discontinue')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminRenewProductDiscontinueController {
  constructor(
    private readonly discontinueService: AdminRenewProductDiscontinueService,
  ) {}

  private adminUserId(user: { userId?: string; sub?: string; _id?: string }): string {
    const id = user?.userId ?? user?.sub ?? user?._id;
    if (!id) {
      throw new BadRequestException('User ID not found in token');
    }
    return String(id);
  }

  @Get('products')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({ summary: 'List products for discontinue tab' })
  @ApiParam({ name: 'urnNo', type: String })
  async listProducts(@Param('urnNo') urnNo: string) {
    const data = await this.discontinueService.listProducts(urnNo);
    return { success: true, data };
  }

  @Patch('products/bulk-reactivate')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @ApiOperation({ summary: 'Bulk reactivate discontinued products to certified (2)' })
  @ApiParam({ name: 'urnNo', type: String })
  async bulkReactivate(
    @Param('urnNo') urnNo: string,
    @Body() body: BulkReactivateProductsBodyDto,
    @CurrentUser() user: { userId?: string; sub?: string; _id?: string },
  ) {
    const data = await this.discontinueService.bulkReactivate(
      urnNo,
      body.productIds ?? [],
      this.adminUserId(user),
    );
    return { success: true, ...data };
  }

  @Patch('products/:productId/toggle-status')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @ApiOperation({ summary: 'Toggle product status between certified (2) and discontinued (4)' })
  @ApiParam({ name: 'urnNo', type: String })
  @ApiParam({ name: 'productId', type: String })
  async toggleStatus(
    @Param('urnNo') urnNo: string,
    @Param('productId') productId: string,
    @Body() body: ToggleProductStatusBodyDto,
    @CurrentUser() user: { userId?: string; sub?: string; _id?: string },
  ) {
    const data = await this.discontinueService.toggleProductStatus(
      urnNo,
      productId,
      body.currentStatus,
      this.adminUserId(user),
      body.reason,
    );
    return { success: true, ...data };
  }
}
