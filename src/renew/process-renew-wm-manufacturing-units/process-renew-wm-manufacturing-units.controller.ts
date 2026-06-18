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
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';
import { CreateProcessWmManufacturingUnitDto } from '../../process-wm-manufacturing-units/dto/create-process-wm-manufacturing-unit.dto';
import { DeleteProcessWmManufacturingUnitDto } from '../../process-wm-manufacturing-units/dto/delete-process-wm-manufacturing-unit.dto';
import { assertRenewProcessActorForUrn } from '../helpers/renew-process-controller.util';
import { ProcessRenewWmManufacturingUnitsService } from './process-renew-wm-manufacturing-units.service';

@ApiTags('Renew - WM Manufacturing Units')
@Controller('renew/process-wm-manufacturing-units')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessRenewWmManufacturingUnitsController {
  constructor(
    private readonly service: ProcessRenewWmManufacturingUnitsService,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create or update renewal WM manufacturing unit (per URN)',
  })
  @ApiBody({ type: CreateProcessWmManufacturingUnitDto })
  @ApiResponse({ status: 201, description: 'Saved successfully' })
  async create(
    @CurrentUser() user: { vendorId?: string; manufacturerId?: string },
    @Body() dto: CreateProcessWmManufacturingUnitDto,
  ) {
    if (!dto?.urnNo?.trim()) {
      throw new BadRequestException('URN number is required');
    }
    await assertRenewProcessActorForUrn(this.productModel, user, dto.urnNo);
    const data = await this.service.upsert(dto);
    return { success: true, message: 'Renew WM manufacturing unit saved successfully', data };
  }

  @Post('delete')
  @ApiOperation({
    summary:
      'Delete renewal WM manufacturing unit (POST body; for clients that cannot send DELETE)',
  })
  @ApiBody({ type: DeleteProcessWmManufacturingUnitDto })
  async removePost(
    @CurrentUser() user: { vendorId?: string; manufacturerId?: string },
    @Body() body: DeleteProcessWmManufacturingUnitDto,
  ) {
    if (!body?.urnNo?.trim()) {
      throw new BadRequestException('URN number is required');
    }
    await assertRenewProcessActorForUrn(this.productModel, user, body.urnNo);
    const data = await this.service.deleteById(
      body.processWmManufacturingUnitId,
      body.urnNo,
    );
    return { success: true, message: 'Renew WM manufacturing unit deleted successfully', data };
  }

  @Get(':urnNo')
  @ApiOperation({ summary: 'List renewal WM manufacturing units by URN and cycle' })
  @ApiParam({ name: 'urnNo', example: 'URN-20260305124230' })
  @ApiQuery({
    name: 'renewalCycleId',
    required: false,
    description: 'Renewal cycle scope (required when multiple cycles exist)',
  })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  async listByUrn(
    @CurrentUser() user: { vendorId?: string; manufacturerId?: string },
    @Param('urnNo') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    if (!urnNo?.trim()) {
      throw new BadRequestException('URN number is required');
    }
    await assertRenewProcessActorForUrn(this.productModel, user, urnNo);
    const data = await this.service.listByUrn(urnNo.trim(), renewalCycleId);
    return { success: true, message: 'Renew WM manufacturing units fetched successfully', data };
  }

  @Delete(':processWmManufacturingUnitId')
  @ApiOperation({ summary: 'Delete renewal WM manufacturing unit by id' })
  @ApiParam({
    name: 'processWmManufacturingUnitId',
    example: 1,
    description:
      'Numeric id (accepts initial field name; stored as processRenewWmManufacturingUnitId)',
  })
  @ApiQuery({
    name: 'urnNo',
    required: true,
    example: 'URN-20260305124230',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted successfully, or null if already removed (idempotent)',
  })
  async remove(
    @CurrentUser() user: { vendorId?: string; manufacturerId?: string },
    @Param('processWmManufacturingUnitId', ParseIntPipe)
    processWmManufacturingUnitId: number,
    @Query('urnNo') urnNo: string,
  ) {
    if (!urnNo?.trim()) {
      throw new BadRequestException('URN number is required');
    }
    await assertRenewProcessActorForUrn(this.productModel, user, urnNo);
    const data = await this.service.deleteById(
      processWmManufacturingUnitId,
      urnNo,
    );
    return { success: true, message: 'Renew WM manufacturing unit deleted successfully', data };
  }
}
