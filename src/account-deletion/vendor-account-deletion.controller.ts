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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateAccountDeletionRequestDto } from './dto/create-account-deletion-request.dto';
import { AccountDeletionService } from './account-deletion.service';

@ApiTags('Vendor Account Deletion')
@Controller('api/vendor/account-deletion-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorAccountDeletionController {
  constructor(
    private readonly accountDeletionService: AccountDeletionService,
  ) {}

  private requireVendorId(user: {
    vendorId?: string;
    manufacturerId?: string;
  }): string {
    const vendorId = user?.vendorId || user?.manufacturerId;
    if (!vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    return String(vendorId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List account deletion requests for the logged-in vendor',
  })
  @ApiResponse({ status: 200, description: 'Requests retrieved successfully' })
  async findAll(
    @CurrentUser()
    user: { vendorId?: string; manufacturerId?: string },
  ) {
    const vendorId = this.requireVendorId(user);
    const data = await this.accountDeletionService.findAllForVendor(vendorId);
    return {
      message: 'Account deletion requests retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single account deletion request' })
  @ApiParam({ name: 'id', description: 'Request MongoDB ObjectId' })
  @ApiResponse({ status: 200, description: 'Request retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(
    @CurrentUser()
    user: { vendorId?: string; manufacturerId?: string },
    @Param('id') id: string,
  ) {
    const vendorId = this.requireVendorId(user);
    const data = await this.accountDeletionService.findOneForVendor(
      id,
      vendorId,
    );
    return {
      message: 'Account deletion request retrieved successfully',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit an account deletion request',
    description:
      'Creates a deletion request workflow entry. Does not permanently delete the account. Status starts as Requested.',
  })
  @ApiBody({ type: CreateAccountDeletionRequestDto })
  @ApiResponse({ status: 201, description: 'Request created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(
    @CurrentUser()
    user: { vendorId?: string; manufacturerId?: string },
    @Body() dto: CreateAccountDeletionRequestDto,
  ) {
    const vendorId = this.requireVendorId(user);
    const data = await this.accountDeletionService.createForVendor(
      vendorId,
      dto,
    );
    return {
      message: 'Account deletion request submitted successfully',
      data,
    };
  }
}
