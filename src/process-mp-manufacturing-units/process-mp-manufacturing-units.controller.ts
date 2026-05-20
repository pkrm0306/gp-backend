import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProcessMpManufacturingUnitsService } from './process-mp-manufacturing-units.service';
import { CreateProcessMpManufacturingUnitDto } from './dto/create-process-mp-manufacturing-unit.dto';

@ApiTags('Process MP Manufacturing Units')
@Controller('process-mp-manufacturing-units')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessMpManufacturingUnitsController {
  constructor(private readonly service: ProcessMpManufacturingUnitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create MP manufacturing unit record (per URN)' })
  @ApiBody({ type: CreateProcessMpManufacturingUnitDto })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateProcessMpManufacturingUnitDto,
  ) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');
    if (!dto?.urnNo || dto.urnNo.trim() === '')
      throw new BadRequestException('URN number is required');
    const data = await this.service.create(dto, user.vendorId);
    return { success: true, data };
  }

  @Delete(':processMpManufacturingUnitId')
  @ApiOperation({ summary: 'Delete MP manufacturing unit by id (scoped to URN)' })
  @ApiParam({
    name: 'processMpManufacturingUnitId',
    example: 15,
    description: 'Numeric process_mp_manufacturing_units id',
  })
  @ApiQuery({
    name: 'urnNo',
    required: true,
    example: 'URN-20260305124230',
    description: 'URN the unit belongs to',
  })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiResponse({ status: 404, description: 'Unit not found for this URN / vendor' })
  async remove(
    @CurrentUser() user: any,
    @Param('processMpManufacturingUnitId', ParseIntPipe)
    processMpManufacturingUnitId: number,
    @Query('urnNo') urnNo: string,
  ) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');
    if (!urnNo || urnNo.trim() === '')
      throw new BadRequestException('URN number is required');
    const data = await this.service.deleteById(
      processMpManufacturingUnitId,
      urnNo,
      user.vendorId,
    );
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({ summary: 'List MP manufacturing unit records by URN' })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  async listByUrn(@CurrentUser() user: any, @Param('urn_no') urnNo: string) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');
    if (!urnNo || urnNo.trim() === '')
      throw new BadRequestException('URN number is required');
    const data = await this.service.listByUrn(urnNo.trim(), user.vendorId);
    return { success: true, data };
  }
}
