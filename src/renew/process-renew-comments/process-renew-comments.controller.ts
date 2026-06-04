import {

  Controller,

  Post,

  Get,

  Body,

  Param,

  Query,

  UseGuards,

} from '@nestjs/common';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { ProcessRenewCommentsService } from './process-renew-comments.service';
import { RenewDetailsService } from '../services/renew-details.service';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';

import { assertRenewProcessActorForUrn } from '../helpers/renew-process-controller.util';



@ApiTags('Renew - Comments')

@Controller('renew/process-comments')

@UseGuards(JwtAuthGuard)

@ApiBearerAuth()

export class ProcessRenewCommentsController {

  constructor(

    private readonly processRenewCommentsService: ProcessRenewCommentsService,

    private readonly renewDetailsService: RenewDetailsService,

    @InjectModel(Product.name)

    private readonly productModel: Model<ProductDocument>,

  ) {}



  @Post()

  @ApiOperation({ summary: 'Create or update renewal process comments' })

  async upsert(@CurrentUser() user: any, @Body() body: any) {

    await assertRenewProcessActorForUrn(this.productModel, user, body.urnNo);

    const data = await this.processRenewCommentsService.upsert(body);

    return { success: true, message: 'Renew comments saved successfully', data };

  }



  @Get(':urnNo')

  @ApiOperation({ summary: 'Get renewal process comments by URN' })

  async getByUrn(
    @Param('urnNo') urnNo: string,
    @Query('renewalCycleId') renewalCycleId?: string,
  ) {
    const data = await this.renewDetailsService.getCommentsByUrn(
      urnNo,
      renewalCycleId?.trim(),
    );

    return { success: true, message: 'Renew comments fetched successfully', data };
  }

}


