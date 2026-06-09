import {

  Controller,

  Post,

  Get,

  Body,

  Param,

  Query,

  UseGuards,

  UseInterceptors,

  UploadedFiles,

} from '@nestjs/common';

import { AnyFilesInterceptor } from '@nestjs/platform-express';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';

import { wasteManagementMultipartMemoryMulterOptions } from '../../common/upload/multer-universal.config';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { ProcessRenewWasteManagementService } from './process-renew-waste-management.service';
import { RenewDetailsService } from '../services/renew-details.service';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';

import { assertRenewProcessActorForUrn } from '../helpers/renew-process-controller.util';
import { parseMultipartJsonIdArray } from '../../product-design/product-design-upload.util';



@ApiTags('Renew - Waste Management')

@Controller('renew/process-waste-management')

@UseGuards(JwtAuthGuard)

@ApiBearerAuth()

export class ProcessRenewWasteManagementController {

  constructor(

    private readonly processRenewWasteManagementService: ProcessRenewWasteManagementService,

    private readonly renewDetailsService: RenewDetailsService,

    @InjectModel(Product.name)

    private readonly productModel: Model<ProductDocument>,

  ) {}



  @Post()

  @UseInterceptors(

    AnyFilesInterceptor(wasteManagementMultipartMemoryMulterOptions()),

  )

  @ApiConsumes('multipart/form-data')

  @ApiOperation({ summary: 'Create or update renewal waste management' })

  async create(

    @CurrentUser() user: any,

    @Body() body: any,

    @UploadedFiles() files?: Express.Multer.File[],

  ) {

    await assertRenewProcessActorForUrn(this.productModel, user, body.urnNo);

    const wmFiles = (files || []).filter(

      (f) => f.fieldname === 'wmSupportingDocumentsFile',

    );

    const data = await this.processRenewWasteManagementService.upsert(
      {
        urnNo: body.urnNo,
        renewalCycleId: body.renewalCycleId
          ? String(body.renewalCycleId)
          : undefined,
        wmImplementationDetails: body.wmImplementationDetails,
        processWasteManagementStatus: body.processWasteManagementStatus
          ? parseInt(body.processWasteManagementStatus, 10)
          : undefined,
        existingDocumentIds: parseMultipartJsonIdArray(
          body.existingDocumentIds ?? body.existing_document_ids,
        ),
      },
      wmFiles,
    );

    return { success: true, message: 'Renew waste management saved successfully', data };

  }



  @Get(':urnNo')

  @ApiOperation({ summary: 'Get renewal waste management by URN' })

  async getByUrn(
    @Param('urnNo') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    const data = await this.renewDetailsService.getWasteByUrn(
      urnNo,
      renewalCycleId,
    );
    return { success: true, message: 'Renew waste management fetched successfully', data };
  }

}


