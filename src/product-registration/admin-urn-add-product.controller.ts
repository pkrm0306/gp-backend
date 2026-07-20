import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import {
  PRODUCTS_ADD_ANY,
  PRODUCTS_VIEW_ANY,
} from '../common/constants/permissions.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AdminAddProductToUrnService } from './services/admin-add-product-to-urn.service';
import { AdminAddProductToUrnDto } from './dto/admin-add-product-to-urn.dto';

@ApiTags('Admin Products')
@Controller('api/admin/products/urn')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminUrnAddProductController {
  constructor(
    private readonly adminAddProductToUrnService: AdminAddProductToUrnService,
  ) {}

  private adminUserId(user: { userId?: string; sub?: string; _id?: string }): string {
    const id = user?.userId ?? user?.sub ?? user?._id;
    if (!id) {
      throw new BadRequestException('User ID not found in token');
    }
    return String(id);
  }

  @Get(':urnNo/add-product/context')
  @AnyPermissions(...PRODUCTS_VIEW_ANY)
  @ApiOperation({ summary: 'Add-product form context for an existing URN' })
  @ApiParam({ name: 'urnNo', type: String })
  @ApiResponse({ status: 200, description: 'URN context for add-product form' })
  @ApiResponse({ status: 404, description: 'URN not found' })
  async getAddProductContext(@Param('urnNo') urnNo: string) {
    return this.adminAddProductToUrnService.getAddProductContext(urnNo);
  }

  @Post(':urnNo/add-product')
  @AnyPermissions(...PRODUCTS_ADD_ANY)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add one new EOI product to an existing URN (admin)' })
  @ApiParam({ name: 'urnNo', type: String })
  @ApiResponse({ status: 201, description: 'Product added to URN' })
  @ApiResponse({ status: 400, description: 'Validation or eligibility failure' })
  @ApiResponse({ status: 404, description: 'URN not found' })
  @ApiResponse({ status: 409, description: 'EOI assignment conflict' })
  async addProductToUrn(
    @Param('urnNo') urnNo: string,
    @Body() dto: AdminAddProductToUrnDto,
    @CurrentUser() user: { userId?: string; sub?: string; _id?: string },
  ) {
    return this.adminAddProductToUrnService.addProductToUrn(
      urnNo,
      dto,
      this.adminUserId(user),
    );
  }
}
