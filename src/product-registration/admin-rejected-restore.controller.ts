import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminRejectedRestoreService } from './services/admin-rejected-restore.service';
import {
  AdminRejectedRestoreProductDto,
  AdminRejectedRestoreUrnDto,
} from './dto/admin-rejected-restore.dto';

@ApiTags('Admin Products')
@Controller('api/admin/products/rejected-restore')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminRejectedRestoreController {
  constructor(
    private readonly rejectedRestoreService: AdminRejectedRestoreService,
  ) {}

  private adminUserId(user: { userId?: string; sub?: string; _id?: string }): string {
    const id = user?.userId ?? user?.sub ?? user?._id;
    if (!id) {
      throw new BadRequestException('User ID not found in token');
    }
    return String(id);
  }

  @Get('options')
  @Permissions(PERMISSIONS.PRODUCTS_VIEW)
  @ApiOperation({
    summary: 'Restore target options for a URN (certified gate)',
  })
  @ApiQuery({ name: 'urnNo', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Allowed restore targets for URN' })
  async getRestoreOptions(@Query('urnNo') urnNo: string) {
    return this.rejectedRestoreService.getRestoreOptions(urnNo);
  }

  @Patch('product')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore one rejected product to Un-certified (0) or Certified (2)' })
  @ApiResponse({ status: 200, description: 'Product restored' })
  @ApiResponse({ status: 400, description: 'Invalid target or URN certified gate violation' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product is not rejected' })
  async restoreProduct(
    @Body() dto: AdminRejectedRestoreProductDto,
    @CurrentUser() user: { userId?: string; sub?: string; _id?: string },
  ) {
    return this.rejectedRestoreService.restoreProduct(
      dto.urnNo,
      dto.productId,
      dto.targetStatus,
      this.adminUserId(user),
      dto.eoiNo,
    );
  }

  @Patch('urn')
  @Permissions(PERMISSIONS.PRODUCTS_UPDATE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restore all rejected products on a URN to Un-certified (0) or Certified (2)',
  })
  @ApiResponse({ status: 200, description: 'URN rejected products restored' })
  @ApiResponse({ status: 404, description: 'No rejected products on this URN' })
  async restoreUrn(
    @Body() dto: AdminRejectedRestoreUrnDto,
    @CurrentUser() user: { userId?: string; sub?: string; _id?: string },
  ) {
    return this.rejectedRestoreService.restoreUrn(
      dto.urnNo,
      dto.targetStatus,
      this.adminUserId(user),
    );
  }
}
