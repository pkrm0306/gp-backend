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
import { RawMaterialsRecycledContentService } from './raw-materials-recycled-content.service';
import { CreateRawMaterialsRecycledContentDto } from './dto/create-raw-materials-recycled-content.dto';

@ApiTags('Raw Materials Recycled Content')
@Controller('raw-materials-recycled-content')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsRecycledContentController {
  constructor(private readonly service: RawMaterialsRecycledContentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials recycled content record (per URN)',
  })
  @ApiBody({ type: CreateRawMaterialsRecycledContentDto })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateRawMaterialsRecycledContentDto,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.service.create(dto, user.vendorId);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List raw materials recycled content records by URN',
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
