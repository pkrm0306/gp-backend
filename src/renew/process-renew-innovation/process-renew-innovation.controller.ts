import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { certificationMultipartMemoryMulterOptions } from '../../common/upload/multer-universal.config';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProcessRenewInnovationService } from './process-renew-innovation.service';
import { RenewDetailsService } from '../services/renew-details.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';
import { assertRenewProcessActorForUrn } from '../helpers/renew-process-controller.util';

@ApiTags('Renew - Innovation')
@Controller('renew/process-innovation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessRenewInnovationController {
  constructor(
    private readonly processRenewInnovationService: ProcessRenewInnovationService,
    private readonly renewDetailsService: RenewDetailsService,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor(certificationMultipartMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create or update renewal process innovation' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    await assertRenewProcessActorForUrn(this.productModel, user, body.urnNo);
    const uploadFiles = (files || []).filter(
      (f) => f.fieldname === 'innovationImplementationDocumentsFile',
    );
    const data = await this.processRenewInnovationService.upsert(
      {
        urnNo: body.urnNo,
        innovationImplementationDetails: body.innovationImplementationDetails,
        processInnovationStatus: body.processInnovationStatus
          ? parseInt(body.processInnovationStatus, 10)
          : undefined,
      },
      uploadFiles,
    );
    return { success: true, message: 'Renew innovation saved successfully', data };
  }

  @Get(':urnNo')
  @ApiOperation({ summary: 'Get renewal process innovation by URN' })
  async getByUrn(@Param('urnNo') urnNo: string) {
    const data = await this.renewDetailsService.getInnovationByUrn(urnNo);
    return { success: true, message: 'Renew innovation fetched successfully', data };
  }
}
