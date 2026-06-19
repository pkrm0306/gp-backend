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
import { CreateProcessRenewMpManufacturingUnitDto } from './dto/create-process-renew-mp-manufacturing-unit.dto';
import { assertRenewProcessActorForUrn } from '../helpers/renew-process-controller.util';
import { ProcessRenewMpManufacturingUnitsService } from './process-renew-mp-manufacturing-units.service';

@ApiTags('Renew - MP Manufacturing Units')
@Controller('renew/process-mp-manufacturing-units')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessRenewMpManufacturingUnitsController {
  constructor(
    private readonly service: ProcessRenewMpManufacturingUnitsService,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create or update renewal MP manufacturing unit (per URN)',
  })
  @ApiBody({ type: CreateProcessRenewMpManufacturingUnitDto })
  @ApiResponse({ status: 201, description: 'Saved successfully' })
  async create(
    @CurrentUser() user: { vendorId?: string; manufacturerId?: string },
    @Body() dto: CreateProcessRenewMpManufacturingUnitDto,
  ) {
    if (!dto?.urnNo?.trim()) {
      throw new BadRequestException('URN number is required');
    }
    await assertRenewProcessActorForUrn(this.productModel, user, dto.urnNo);
    const data = await this.service.upsert(dto);
    return { success: true, message: 'Renew MP manufacturing unit saved successfully', data };
  }

  @Get(':urnNo')
  @ApiOperation({ summary: 'List renewal MP manufacturing units by URN and cycle' })
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
    return { success: true, message: 'Renew MP manufacturing units fetched successfully', data };
  }

  @Delete(':processMpManufacturingUnitId')
  @ApiOperation({ summary: 'Delete renewal MP manufacturing unit by id' })
  @ApiParam({
    name: 'processMpManufacturingUnitId',
    example: 15,
    description:
      'Numeric id (accepts initial field name; stored as processRenewMpManufacturingUnitId)',
  })
  @ApiQuery({
    name: 'urnNo',
    required: true,
    example: 'URN-20260305124230',
  })
  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  async remove(
    @CurrentUser() user: { vendorId?: string; manufacturerId?: string },
    @Param('processMpManufacturingUnitId', ParseIntPipe)
    processMpManufacturingUnitId: number,
    @Query('urnNo') urnNo: string,
  ) {
    if (!urnNo?.trim()) {
      throw new BadRequestException('URN number is required');
    }
    await assertRenewProcessActorForUrn(this.productModel, user, urnNo);
    const data = await this.service.deleteById(
      processMpManufacturingUnitId,
      urnNo,
    );
    return { success: true, message: 'Renew MP manufacturing unit deleted successfully', data };
  }
}
