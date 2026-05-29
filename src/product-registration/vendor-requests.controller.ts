import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProductRegistrationService } from './product-registration.service';
import { VendorProductChangeRequestDto } from './dto/vendor-product-change-request.dto';

@ApiTags('Vendor Requests')
@Controller('api/vendor/requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorRequestsController {
  constructor(
    private readonly productRegistrationService: ProductRegistrationService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List vendor product name change requests',
    description:
      'Returns change requests submitted by the logged-in vendor (newest first).',
  })
  @ApiResponse({ status: 200, description: 'Vendor requests fetched' })
  async listMyRequests(@CurrentUser() user: { manufacturerId?: string }) {
    if (!user?.manufacturerId) {
      throw new BadRequestException('Manufacturer ID not found in token');
    }
    const data =
      await this.productRegistrationService.vendorListProductChangeRequests(
        user.manufacturerId,
      );
    return {
      success: true,
      message: 'Requests fetched successfully',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit product name change request (vendor certified product)',
    description:
      'Creates a pending request that can be reviewed in admin request tab.',
  })
  @ApiBody({ type: VendorProductChangeRequestDto })
  @ApiResponse({ status: 201, description: 'Request submitted successfully' })
  async submitRequest(
    @CurrentUser() user: { manufacturerId?: string },
    @Body() dto: VendorProductChangeRequestDto,
  ) {
    if (!user?.manufacturerId) {
      throw new BadRequestException('Manufacturer ID not found in token');
    }
    const data =
      await this.productRegistrationService.vendorSubmitProductChangeRequest(
        user.manufacturerId,
        dto,
      );
    return {
      success: true,
      message: 'Product name change request submitted successfully',
      data,
    };
  }
}
