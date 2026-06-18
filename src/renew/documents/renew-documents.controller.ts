import {
  Controller,
  Delete,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RenewDocumentsService } from './renew-documents.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';
import { assertRenewProcessActorForUrn } from '../helpers/renew-process-controller.util';

@ApiTags('Renew - Documents')
@Controller('renew/documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RenewDocumentsController {
  constructor(
    private readonly renewDocumentsService: RenewDocumentsService,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  @Delete(':documentId')
  @ApiOperation({
    summary: 'Soft-delete a renewal product document (alias of DELETE /documents with processType=renewal)',
  })
  @ApiParam({ name: 'documentId', type: Number })
  @ApiQuery({ name: 'urnNo', required: true })
  @ApiQuery({ name: 'sectionKey', required: true })
  @ApiQuery({ name: 'renewalCycleId', required: true })
  async deleteDocument(
    @CurrentUser() user: any,
    @Param('documentId', ParseIntPipe) documentId: number,
    @Query('urnNo') urnNo: string,
    @Query('sectionKey') sectionKey: string,
    @Query('renewalCycleId') renewalCycleId: string,
  ) {
    if (!urnNo?.trim() || !sectionKey?.trim() || !renewalCycleId?.trim()) {
      throw new BadRequestException(
        'urnNo, sectionKey, and renewalCycleId are required',
      );
    }

    await assertRenewProcessActorForUrn(this.productModel, user, urnNo);

    const deletedBy = user?.vendorId ?? user?.manufacturerId ?? user?.userId;
    if (!deletedBy) {
      throw new BadRequestException('Unable to resolve user for document delete');
    }

    const data = await this.renewDocumentsService.softDeleteDocument(
      String(documentId),
      { urnNo, sectionKey, renewalCycleId },
      deletedBy,
    );
    return {
      success: true,
      message: 'Document deleted successfully',
      data,
    };
  }
}
