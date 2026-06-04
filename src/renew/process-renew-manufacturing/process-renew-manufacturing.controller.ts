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

import { ProcessRenewManufacturingService } from './process-renew-manufacturing.service';
import { RenewDetailsService } from '../services/renew-details.service';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';

import { assertRenewProcessActorForUrn } from '../helpers/renew-process-controller.util';



@ApiTags('Renew - Manufacturing')

@Controller('renew/process-manufacturing')

@UseGuards(JwtAuthGuard)

@ApiBearerAuth()

export class ProcessRenewManufacturingController {

  constructor(

    private readonly processRenewManufacturingService: ProcessRenewManufacturingService,

    private readonly renewDetailsService: RenewDetailsService,

    @InjectModel(Product.name)

    private readonly productModel: Model<ProductDocument>,

  ) {}



  @Post()

  @UseInterceptors(

    AnyFilesInterceptor(certificationMultipartMemoryMulterOptions()),

  )

  @ApiConsumes('multipart/form-data')

  @ApiOperation({ summary: 'Create or update renewal process manufacturing' })

  async create(

    @CurrentUser() user: any,

    @Body() body: any,

    @UploadedFiles() files?: Express.Multer.File[],

  ) {

    await assertRenewProcessActorForUrn(this.productModel, user, body.urnNo);

    const conservationFiles = (files || []).filter(

      (f) => f.fieldname === 'energyConservationSupportingDocumentsFile',

    );

    const consumptionFiles = (files || []).filter(

      (f) => f.fieldname === 'energyConsumptionDocumentsFile',

    );

    const data = await this.processRenewManufacturingService.upsert(

      {

        urnNo: body.urnNo,

        portableWaterDemand: body.portableWaterDemand,

        rainWaterHarvesting: body.rainWaterHarvesting,

        beyondTheFenceInitiatives: body.beyondTheFenceInitiatives,

        totalEnergyConsumption: body.totalEnergyConsumption

          ? parseInt(body.totalEnergyConsumption, 10)

          : undefined,

        processManufacturingStatus: body.processManufacturingStatus

          ? parseInt(body.processManufacturingStatus, 10)

          : undefined,

      },

      conservationFiles,

      consumptionFiles,

    );

    return { success: true, message: 'Renew manufacturing saved successfully', data };

  }



  @Get(':urnNo')

  @ApiOperation({ summary: 'Get renewal process manufacturing by URN' })

  async getByUrn(@Param('urnNo') urnNo: string) {
    const data = await this.renewDetailsService.getManufacturingByUrn(urnNo);
    return { success: true, message: 'Renew manufacturing fetched successfully', data };
  }

}


