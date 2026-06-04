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

import { ProcessRenewProductStewardshipService } from './process-renew-product-stewardship.service';
import { RenewDetailsService } from '../services/renew-details.service';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';

import { assertRenewProcessActorForUrn } from '../helpers/renew-process-controller.util';



@ApiTags('Renew - Product Stewardship')

@Controller('renew/process-product-stewardship')

@UseGuards(JwtAuthGuard)

@ApiBearerAuth()

export class ProcessRenewProductStewardshipController {

  constructor(

    private readonly processRenewProductStewardshipService: ProcessRenewProductStewardshipService,

    private readonly renewDetailsService: RenewDetailsService,

    @InjectModel(Product.name)

    private readonly productModel: Model<ProductDocument>,

  ) {}



  @Post()

  @UseInterceptors(

    AnyFilesInterceptor(certificationMultipartMemoryMulterOptions()),

  )

  @ApiConsumes('multipart/form-data')

  @ApiOperation({ summary: 'Create or update renewal product stewardship' })

  async create(

    @CurrentUser() user: any,

    @Body() body: any,

    @UploadedFiles() files?: Express.Multer.File[],

  ) {

    await assertRenewProcessActorForUrn(this.productModel, user, body.urnNo);

    const seaFiles = (files || []).filter(

      (f) => f.fieldname === 'seaSupportingDocumentsFile',

    );

    const qmFiles = (files || []).filter(

      (f) => f.fieldname === 'qmSupportingDocumentsFile',

    );

    const eprFiles = (files || []).filter(

      (f) => f.fieldname === 'eprSupportingDocumentsFile',

    );

    const data = await this.processRenewProductStewardshipService.upsert(

      {

        urnNo: body.urnNo,

        qualityManagementDetails: body.qualityManagementDetails,

        eprImplementedDetails: body.eprImplementedDetails,

        eprGreenPackagingDetails: body.eprGreenPackagingDetails,

        productStewardshipStatus: body.productStewardshipStatus

          ? parseInt(body.productStewardshipStatus, 10)

          : undefined,

      },

      seaFiles,

      qmFiles,

      eprFiles,

    );

    return { success: true, message: 'Renew product stewardship saved successfully', data };

  }



  @Get(':urnNo')

  @ApiOperation({ summary: 'Get renewal product stewardship by URN' })

  async getByUrn(@Param('urnNo') urnNo: string) {

    const data = await this.renewDetailsService.getStewardshipByUrn(urnNo);

    return { success: true, message: 'Renew product stewardship fetched successfully', data };

  }

}


