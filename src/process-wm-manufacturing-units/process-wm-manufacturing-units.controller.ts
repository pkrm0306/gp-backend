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
import { ProcessWmManufacturingUnitsService } from './process-wm-manufacturing-units.service';
import { CreateProcessWmManufacturingUnitDto } from './dto/create-process-wm-manufacturing-unit.dto';
import { DeleteProcessWmManufacturingUnitDto } from './dto/delete-process-wm-manufacturing-unit.dto';

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
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateProcessWmManufacturingUnitDto,
  ) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');
    if (!dto?.urnNo || dto.urnNo.trim() === '')
      throw new BadRequestException('URN number is required');
    const data = await this.service.create(dto, user.vendorId);
    return { success: true, data };
  }

  @Post('delete')
  @ApiOperation({
    summary:
      'Delete WM manufacturing unit by id (POST body; for clients that cannot send DELETE)',
  })
  @ApiBody({ type: DeleteProcessWmManufacturingUnitDto })
  @ApiResponse({
    status: 200,
    description: 'Deleted successfully, or nothing to delete (idempotent; data may be null)',
  })
  async removePost(
    @CurrentUser() user: any,
    @Body() body: DeleteProcessWmManufacturingUnitDto,
  ) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');
    if (!body?.urnNo || body.urnNo.trim() === '')
      throw new BadRequestException('URN number is required');
    const data = await this.service.deleteById(
      body.processWmManufacturingUnitId,
      body.urnNo,
      user.vendorId,
    );
    return { success: true, data };
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete WM manufacturing unit by query params',
  })
  @ApiQuery({ name: 'urnNo', required: true, example: 'URN-20260305124230' })
  @ApiQuery({
    name: 'processWmManufacturingUnitId',
    required: true,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted successfully, or nothing to delete (idempotent; data may be null)',
  })
  async removeByQuery(
    @CurrentUser() user: any,
    @Query('processWmManufacturingUnitId', ParseIntPipe)
    processWmManufacturingUnitId: number,
    @Query('urnNo') urnNo: string,
  ) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');
    if (!urnNo || urnNo.trim() === '')
      throw new BadRequestException('URN number is required');
    const data = await this.service.deleteById(
      processWmManufacturingUnitId,
      urnNo,
      user.vendorId,
    );
    return { success: true, data };
  }

  @Delete(':processWmManufacturingUnitId')
  @ApiOperation({ summary: 'Delete WM manufacturing unit by id (scoped to URN)' })
  @ApiParam({
    name: 'processWmManufacturingUnitId',
    example: 1,
    description: 'Numeric process_wm_manufacturing_units id',
  })
  @ApiQuery({
    name: 'urnNo',
    required: true,
    example: 'URN-20260305124230',
    description: 'URN the unit belongs to',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted successfully, or nothing to delete (idempotent; data may be null)',
  })
  async remove(
    @CurrentUser() user: any,
    @Param('processWmManufacturingUnitId', ParseIntPipe)
    processWmManufacturingUnitId: number,
    @Query('urnNo') urnNo: string,
  ) {
    if (!user?.vendorId)
      throw new BadRequestException('Vendor ID not found in token');
    if (!urnNo || urnNo.trim() === '')
      throw new BadRequestException('URN number is required');
    const data = await this.service.deleteById(
      processWmManufacturingUnitId,
      urnNo,
      user.vendorId,
    );
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({ summary: 'List WM manufacturing unit records by URN' })
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
