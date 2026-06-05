import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminExpiredReactivateService } from './services/admin-expired-reactivate.service';
import {
  AdminExpiredReactivateProductDto,
  AdminExpiredReactivateUrnDto,
} from './dto/admin-expired-reactivate.dto';

@ApiTags('Admin Products')
@Controller('api/admin/products/expired-reactivate')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminExpiredReactivateController {
  constructor(
    private readonly expiredReactivateService: AdminExpiredReactivateService,
  ) {}

  private adminUserId(user: { userId?: string; sub?: string; _id?: string }): string {
    const id = user?.userId ?? user?.sub ?? user?._id;
    if (!id) {
      throw new BadRequestException('User ID not found in token');
    }
    return String(id);
  }

  @Patch('product')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reactivate one expired product to certified (4 → 2)' })
  @ApiResponse({ status: 200, description: 'Product reactivated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product is not expired' })
  async reactivateProduct(
    @Body() dto: AdminExpiredReactivateProductDto,
    @CurrentUser() user: { userId?: string; sub?: string; _id?: string },
  ) {
    return this.expiredReactivateService.reactivateProduct(
      dto.urnNo,
      dto.productId,
      this.adminUserId(user),
      dto.eoiNo,
    );
  }

  @Patch('urn')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reactivate all expired products on a URN to certified (4 → 2)',
  })
  @ApiResponse({ status: 200, description: 'URN products reactivated' })
  @ApiResponse({ status: 404, description: 'No expired products on this URN' })
  async reactivateUrn(
    @Body() dto: AdminExpiredReactivateUrnDto,
    @CurrentUser() user: { userId?: string; sub?: string; _id?: string },
  ) {
    return this.expiredReactivateService.reactivateUrn(
      dto.urnNo,
      this.adminUserId(user),
    );
  }
}
