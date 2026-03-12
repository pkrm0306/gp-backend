import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProcessWmManufacturingUnitsService } from './process-wm-manufacturing-units.service';
import { CreateProcessWmManufacturingUnitDto } from './dto/create-process-wm-manufacturing-unit.dto';

@ApiTags('Process WM Manufacturing Units')
@Controller('process-wm-manufacturing-units')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessWmManufacturingUnitsController {
  constructor(private readonly service: ProcessWmManufacturingUnitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create WM manufacturing unit record (per URN)' })
  @ApiBody({ type: CreateProcessWmManufacturingUnitDto })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(@CurrentUser() user: any, @Body() dto: CreateProcessWmManufacturingUnitDto) {
    if (!user?.vendorId) throw new BadRequestException('Vendor ID not found in token');
    if (!dto?.urnNo || dto.urnNo.trim() === '') throw new BadRequestException('URN number is required');
    const data = await this.service.create(dto, user.vendorId);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({ summary: 'List WM manufacturing unit records by URN' })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  async listByUrn(@CurrentUser() user: any, @Param('urn_no') urnNo: string) {
    if (!user?.vendorId) throw new BadRequestException('Vendor ID not found in token');
    if (!urnNo || urnNo.trim() === '') throw new BadRequestException('URN number is required');
    const data = await this.service.listByUrn(urnNo.trim(), user.vendorId);
    return { success: true, data };
  }
}
