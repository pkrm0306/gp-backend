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
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import { PRODUCTS_UPDATE_ANY } from '../common/constants/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminCertifiedRejectService } from './services/admin-certified-reject.service';
import {
  AdminCertifiedRejectProductDto,
  AdminCertifiedRejectUrnDto,
} from './dto/admin-certified-reject.dto';

@ApiTags('Admin Products')
@Controller('api/admin/products/certified-reject')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminCertifiedRejectController {
  constructor(
    private readonly certifiedRejectService: AdminCertifiedRejectService,
  ) {}

  private adminUserId(user: { userId?: string; sub?: string; _id?: string }): string {
    const id = user?.userId ?? user?.sub ?? user?._id;
    if (!id) {
      throw new BadRequestException('User ID not found in token');
    }
    return String(id);
  }

  @Patch('product')
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject one certified product (2 → 3); eoiNo unchanged' })
  @ApiResponse({ status: 200, description: 'Product rejected' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product is not certified' })
  async rejectProduct(
    @Body() dto: AdminCertifiedRejectProductDto,
    @CurrentUser() user: { userId?: string; sub?: string; _id?: string },
  ) {
    return this.certifiedRejectService.rejectProduct(
      dto.urnNo,
      dto.productId,
      this.adminUserId(user),
      {
        eoiNo: dto.eoiNo,
        rejectionReason: dto.rejectionReason,
        rejectedDetails: dto.rejectedDetails,
      },
    );
  }

  @Patch('urn')
  @AnyPermissions(...PRODUCTS_UPDATE_ANY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reject all certified products on a URN (2 → 3); eoiNo unchanged',
  })
  @ApiResponse({ status: 200, description: 'URN certified products rejected' })
  @ApiResponse({ status: 404, description: 'No certified products on this URN' })
  async rejectUrn(
    @Body() dto: AdminCertifiedRejectUrnDto,
    @CurrentUser() user: { userId?: string; sub?: string; _id?: string },
  ) {
    return this.certifiedRejectService.rejectUrn(
      dto.urnNo,
      this.adminUserId(user),
    );
  }
}
