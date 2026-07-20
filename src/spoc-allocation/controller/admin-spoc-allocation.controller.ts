import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants/permissions.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AnyPermissions } from '../../common/decorators/any-permissions.decorator';
import { AssignSpocDto, ReassignSpocDto } from '../dto/assign-spoc.dto';
import { LookupSpocByProductsDto } from '../dto/lookup-spoc-by-products.dto';
import {
  SPOC_ALLOCATION_BASE_PATH,
  SPOC_ALLOCATION_ROUTES,
} from '../routes/spoc-allocation.routes';
import { SpocAllocationService } from '../service/spoc-allocation.service';

@ApiTags('Admin SPOC Allocation')
@Controller(SPOC_ALLOCATION_BASE_PATH)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminSpocAllocationController {
  constructor(private readonly spocAllocationService: SpocAllocationService) {}

  private actorId(user: Record<string, unknown>): string {
    const id = user?.userId ?? user?.sub ?? user?.id ?? user?._id;
    if (id === undefined || id === null || String(id).trim() === '') {
      throw new UnauthorizedException('Authenticated user id missing');
    }
    return String(id);
  }

  /** GET /spoc-allocation/team-members */
  @Get(SPOC_ALLOCATION_ROUTES.teamMembers)
  @Permissions(PERMISSIONS.SPOC_ALLOCATION_ASSIGN)
  @ApiOperation({
    summary:
      'List active GreenPro team members eligible as SPOC (Un-certified Products view)',
    description:
      'Returns active staff (`type=staff`, `status=1`) whose RBAC role grants `products:uncertified:view` (including via parent `products:view`).',
  })
  @ApiResponse({ status: 200, description: 'Active team members' })
  async listActiveTeamMembers() {
    const data = await this.spocAllocationService.listActiveTeamMembers();
    return {
      success: true,
      message: 'Active team members retrieved successfully',
      data,
      total: data.length,
    };
  }

  /**
   * Batch lookup for Assigned SPOC column (internal list helper).
   * Registered before `:productId` routes that share the POST method space.
   */
  @Post(SPOC_ALLOCATION_ROUTES.lookup)
  @HttpCode(HttpStatus.OK)
  @AnyPermissions(
    PERMISSIONS.SPOC_ALLOCATION_ASSIGN,
    PERMISSIONS.PRODUCTS_UNCERTIFIED_VIEW,
  )
  @ApiOperation({
    summary: 'Batch lookup active Assigned SPOC names by product ids',
  })
  @ApiResponse({ status: 200, description: 'Assigned SPOC name map rows' })
  async lookupByProducts(@Body() dto: LookupSpocByProductsDto) {
    const data = await this.spocAllocationService.lookupAssignedSpocNames(
      dto.productIds,
    );
    return {
      success: true,
      message: 'Assigned SPOC names retrieved successfully',
      data,
      total: data.length,
    };
  }

  /** POST /spoc-allocation — first assignment */
  @Post(SPOC_ALLOCATION_ROUTES.root)
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.SPOC_ALLOCATION_ASSIGN)
  @ApiOperation({ summary: 'Assign SPOC to a product (first assignment)' })
  @ApiResponse({ status: 200, description: 'SPOC assigned' })
  async assign(
    @Body() dto: AssignSpocDto,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    const data = await this.spocAllocationService.assign(
      dto,
      this.actorId(user),
    );
    return {
      success: true,
      message: 'SPOC assigned successfully',
      data,
    };
  }

  /** GET /spoc-allocation/:productId */
  @Get(SPOC_ALLOCATION_ROUTES.byProduct)
  @Permissions(PERMISSIONS.SPOC_ALLOCATION_ASSIGN)
  @ApiOperation({ summary: 'Get active SPOC assignment for a product' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 200, description: 'Assigned SPOC or null' })
  async getByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const data =
      await this.spocAllocationService.getAssignedSpocByProduct(productId);
    return {
      success: true,
      message: data
        ? 'Assigned SPOC retrieved successfully'
        : 'No active SPOC assigned for this product',
      data,
    };
  }

  /** PUT /spoc-allocation/:productId — reassignment */
  @Put(SPOC_ALLOCATION_ROUTES.byProduct)
  @HttpCode(HttpStatus.OK)
  @Permissions(PERMISSIONS.SPOC_ALLOCATION_ASSIGN)
  @ApiOperation({
    summary: 'Reassign SPOC for a product with an active allocation',
  })
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 200, description: 'SPOC reassigned' })
  async reassign(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: ReassignSpocDto,
    @CurrentUser() user: Record<string, unknown>,
  ) {
    const data = await this.spocAllocationService.reassign(
      { ...dto, productId },
      this.actorId(user),
    );
    return {
      success: true,
      message: 'SPOC reassigned successfully',
      data,
    };
  }
}
