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
import { RawMaterialsEliminationOfProhibitedFlameService } from './raw-materials-elimination-of-prohibited-flame.service';
import { CreateRawMaterialsEliminationOfProhibitedFlameDto } from './dto/create-raw-materials-elimination-of-prohibited-flame.dto';

@ApiTags('Raw Materials Elimination Of Prohibited Flame')
@Controller('raw-materials-elimination-of-prohibited-flame')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsEliminationOfProhibitedFlameController {
  constructor(
    private readonly service: RawMaterialsEliminationOfProhibitedFlameService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials elimination of prohibited flame record (per URN)',
  })
  @ApiBody({ type: CreateRawMaterialsEliminationOfProhibitedFlameDto })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateRawMaterialsEliminationOfProhibitedFlameDto,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const data = await this.service.create(dto, user.vendorId);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List raw materials elimination of prohibited flame records by URN',
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
