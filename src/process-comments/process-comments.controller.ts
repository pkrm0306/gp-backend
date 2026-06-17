import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import { matchActiveProducts } from '../product-registration/constants/active-product.filter';
import { shouldUseRenewWorkflowForUrn } from '../renew/constants/renewal-urn-status.constants';
import { ProcessRenewCommentsService } from '../renew/process-renew-comments/process-renew-comments.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ProcessCommentsService } from './process-comments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessCommentsDto } from './dto/create-process-comments.dto';
import { formatProcessCommentsForApi } from './helpers/process-comments-payload.util';

@ApiTags('Process Comments')
@Controller('process-comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessCommentsController {
  constructor(
    private readonly processCommentsService: ProcessCommentsService,
    private readonly processRenewCommentsService: ProcessRenewCommentsService,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  private async loadUrnProduct(urnNo: string) {
    return this.productModel
      .findOne(matchActiveProducts({ urnNo: urnNo.trim() }))
      .select('urnNo urnStatus productRenewStatus vendorId')
      .lean()
      .exec();
  }

  private async shouldUseRenewWorkflow(urnNo: string): Promise<boolean> {
    const product = await this.loadUrnProduct(urnNo);
    if (!product) {
      return false;
    }
    return shouldUseRenewWorkflowForUrn({
      urnStatus: Number(product.urnStatus ?? 0),
      productRenewStatus: Number(product.productRenewStatus ?? 0),
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Create or update process comments',
    description:
      'Creates or updates process comments for a specific URN and logged-in vendor. If a record exists for the given URN and vendor ID, it will be updated. Otherwise, a new record will be created. Only provided fields will be updated.',
  })
  @ApiBody({
    type: CreateProcessCommentsDto,
    description:
      'Process comments data. Only urnNo is required. All other fields are optional.',
  })
  @ApiResponse({
    status: 201,
    description: 'Process comments created or updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async createOrUpdate(
    @CurrentUser() user: any,
    @Body() createProcessCommentsDto: CreateProcessCommentsDto,
  ) {
    const urnNo = createProcessCommentsDto.urnNo.trim();
    const product = await this.loadUrnProduct(urnNo);
    if (!product) {
      throw new NotFoundException(`No product found for URN: ${urnNo}`);
    }

    const renew =
      Boolean(createProcessCommentsDto.renewalCycleId?.trim()) ||
      shouldUseRenewWorkflowForUrn({
        urnStatus: Number(product.urnStatus ?? 0),
        productRenewStatus: Number(product.productRenewStatus ?? 0),
      });

    if (renew) {
      if (!createProcessCommentsDto.renewalCycleId?.trim()) {
        throw new BadRequestException(
          'renewalCycleId is required for renewal process comments',
        );
      }
      const data = user?.vendorId
        ? await this.processRenewCommentsService.upsert(createProcessCommentsDto)
        : await this.processRenewCommentsService.adminUpsert(
            createProcessCommentsDto,
          );
      return { success: true, data: formatProcessCommentsForApi(data?.toObject?.() ?? data) };
    }

    const vendorId = String(user?.vendorId ?? product.vendorId ?? '').trim();
    if (!vendorId) {
      throw new BadRequestException('Vendor ID not found for this URN');
    }

    const data = await this.processCommentsService.upsertProcessComments(
      createProcessCommentsDto,
      vendorId,
    );

    return {
      success: true,
      data: formatProcessCommentsForApi(data.toObject() as unknown as Record<string, unknown>),
    };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'Get process comments by URN',
    description:
      'Retrieves process comments for a specific URN. Admin callers resolve vendor from the URN automatically.',
  })
  @ApiParam({
    name: 'urn_no',
    description: 'URN number',
    example: 'URN-20260305124230',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Process comments retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Vendor ID not found in token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getByUrn(
    @CurrentUser() user: any,
    @Param('urn_no') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    const product = await this.loadUrnProduct(urnNo);
    if (!product) {
      throw new NotFoundException(`No product found for URN: ${urnNo}`);
    }

    const renew =
      Boolean(renewalCycleId?.trim()) ||
      shouldUseRenewWorkflowForUrn({
        urnStatus: Number(product.urnStatus ?? 0),
        productRenewStatus: Number(product.productRenewStatus ?? 0),
      });

    if (renew) {
      const data = await this.processRenewCommentsService.getByUrnAndCycle(
        urnNo,
        renewalCycleId?.trim(),
      );
      return {
        success: true,
        data: formatProcessCommentsForApi(
          (data?.toObject?.() ?? data) as unknown as Record<string, unknown> | null,
        ),
      };
    }

    const vendorId = String(user?.vendorId ?? product.vendorId ?? '').trim();
    if (!vendorId) {
      throw new BadRequestException('Vendor ID not found for this URN');
    }

    const data = await this.processCommentsService.getByUrnAndVendor(
      urnNo,
      vendorId,
    );

    return {
      success: true,
      data: formatProcessCommentsForApi(
        (data?.toObject?.() ?? data) as Record<string, unknown> | null,
      ),
    };
  }
}
