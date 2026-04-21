import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RawMaterialsRapidlyRenewableMaterialsService } from './raw-materials-rapidly-renewable-materials.service';
import { CreateRawMaterialsRapidlyRenewableMaterialsDto } from './dto/create-raw-materials-rapidly-renewable-materials.dto';

@ApiTags('Raw Materials Rapidly Renewable Materials')
@Controller('raw-materials-rapidly-renewable-materials')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsRapidlyRenewableMaterialsController {
  constructor(
    private readonly service: RawMaterialsRapidlyRenewableMaterialsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials rapidly renewable materials record (per URN)',
  })
  @ApiBody({ type: CreateRawMaterialsRapidlyRenewableMaterialsDto })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateRawMaterialsRapidlyRenewableMaterialsDto,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.service.create(dto, user.vendorId);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List raw materials rapidly renewable materials records by URN',
  })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  async listByUrn(@CurrentUser() user: any, @Param('urn_no') urnNo: string) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    if (!urnNo || urnNo.trim() === '') {
      throw new BadRequestException('URN number is required');
    }
    const data = await this.service.listByUrn(urnNo.trim(), user.vendorId);
    return { success: true, data };
  }
}
