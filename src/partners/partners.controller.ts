import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { UpdatePartnerStatusDto } from './dto/update-partner-status.dto';

@ApiTags('Partners')
@Controller('partners')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all partners',
    description:
      'Returns all partners for the logged-in vendor where type is "partner" and status is not 2, sorted by name ascending',
  })
  @ApiResponse({ status: 200, description: 'List of partners retrieved successfully' })
  async findAll(@CurrentUser() user: any) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const partners = await this.partnersService.findAll(user.vendorId);
    return {
      message: 'Partners retrieved successfully',
      data: partners,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new partner',
    description:
      'Creates a new partner for the logged-in vendor. Validates unique email and phone within the same vendor. Password is hashed if provided.',
  })
  @ApiBody({ type: CreatePartnerDto })
  @ApiResponse({ status: 201, description: 'Partner created successfully' })
  @ApiResponse({ status: 409, description: 'Email or phone already exists' })
  async create(@CurrentUser() user: any, @Body() createPartnerDto: CreatePartnerDto) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const partner = await this.partnersService.create(user.vendorId, createPartnerDto);
    return {
      message: 'Partner created successfully',
      data: partner,
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a partner',
    description:
      'Updates partner fields. If password is empty, it will not be updated. Validates email and phone uniqueness excluding the current partner.',
  })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiBody({ type: UpdatePartnerDto })
  @ApiResponse({ status: 200, description: 'Partner updated successfully' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  @ApiResponse({ status: 409, description: 'Email or phone already exists' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const partner = await this.partnersService.update(id, user.vendorId, updatePartnerDto);
    return {
      message: 'Partner updated successfully',
      data: partner,
    };
  }

  @Patch('status')
  @ApiOperation({
    summary: 'Toggle partner status',
    description: 'Toggles partner status: if current status is 1, sets to 0; if 0, sets to 1',
  })
  @ApiBody({ type: UpdatePartnerStatusDto })
  @ApiResponse({ status: 200, description: 'Partner status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status or status mismatch' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async updateStatus(
    @CurrentUser() user: any,
    @Body() updateStatusDto: UpdatePartnerStatusDto,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const partner = await this.partnersService.updateStatus(user.vendorId, updateStatusDto);
    return {
      message: 'Partner status updated successfully',
      data: partner,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a partner (soft delete)',
    description: 'Soft deletes a partner by setting status to 2 and updating updatedAt',
  })
  @ApiParam({ name: 'id', description: 'Partner ID' })
  @ApiResponse({ status: 200, description: 'Partner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Partner not found' })
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const partner = await this.partnersService.remove(id, user.vendorId);
    return {
      message: 'Partner deleted successfully',
      data: partner,
    };
  }
}
