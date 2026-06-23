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

  BadRequestException,

} from '@nestjs/common';

import { AnyFilesInterceptor } from '@nestjs/platform-express';

import {

  ApiTags,

  ApiBearerAuth,

  ApiOperation,

  ApiConsumes,

  ApiParam,

  ApiQuery,

  ApiResponse,

} from '@nestjs/swagger';

import { productPerformanceMultipartMemoryMulterOptions } from '../../common/upload/multer-universal.config';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { ProcessRenewProductPerformanceService } from './process-renew-product-performance.service';

import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Product, ProductDocument } from '../../product-registration/schemas/product.schema';

import { assertRenewProcessActorCanReadUrn, assertRenewProcessActorForUrn } from '../helpers/renew-process-controller.util';

import {

  assertProductPerformanceTestReportFileTypes,

  collectProductPerformanceUploadFiles,

  hasAtLeastOneProductPerformanceContent,

  PRODUCT_PERFORMANCE_EMPTY_FORM_MESSAGE,

  parseMultipartJsonIdArray,

} from '../../product-performance/product-performance-upload.util';

import {

  parseIncomingRenewTestReports,

  toPublicRenewTestReports,

} from './renew-product-performance-payload.util';



function bodyHasTestReportsField(body: Record<string, unknown>): boolean {

  return 'testReports' in body || 'test_reports' in body;

}



@ApiTags('Renew - Product Performance')

@Controller('renew/process-product-performance')

@UseGuards(JwtAuthGuard)

@ApiBearerAuth()

export class ProcessRenewProductPerformanceController {

  constructor(

    private readonly processRenewProductPerformanceService: ProcessRenewProductPerformanceService,

    @InjectModel(Product.name)

    private readonly productModel: Model<ProductDocument>,

  ) {}



  @Post()

  @UseInterceptors(

    AnyFilesInterceptor(productPerformanceMultipartMemoryMulterOptions(20)),

  )

  @ApiConsumes('multipart/form-data')

  @ApiOperation({

    summary: 'Save renewal product performance (full replace testReports per URN+cycle)',

    description:

      'Multipart save scoped by urnNo + renewalCycleId. testReports/test_reports fully replaces metadata rows for the cycle. existingDocumentIds retains listed performance documents; files appends new uploads only.',

  })

  async create(

    @CurrentUser() user: any,

    @Body() body: Record<string, unknown>,

    @UploadedFiles() files?: Express.Multer.File[],

  ) {

    const urnNo = String(body.urnNo ?? '').trim();

    if (!urnNo) {

      throw new BadRequestException('urnNo is required');

    }



    await assertRenewProcessActorForUrn(this.productModel, user, urnNo);

    const cycle = await this.processRenewProductPerformanceService.resolveRenewalCycle(

      urnNo,

      body.renewalCycleId ? String(body.renewalCycleId) : undefined,

    );

    const renewalCycleId = String(cycle._id);



    const hasTestReportsPayload = bodyHasTestReportsField(body);

    const testReports = hasTestReportsPayload

      ? parseIncomingRenewTestReports(
          body.testReports ?? body.test_reports,
          undefined,
          body.eoiNo ? String(body.eoiNo).trim() : undefined,
        )

      : undefined;



    const uploadFiles = collectProductPerformanceUploadFiles(files);

    assertProductPerformanceTestReportFileTypes(uploadFiles);



    const existingDocumentIds = parseMultipartJsonIdArray(

      body.existingDocumentIds ?? body.existing_document_ids,

    );



    const retainedDocumentCount =

      await this.processRenewProductPerformanceService.countRetainedRenewPerformanceDocuments(

        urnNo,

        renewalCycleId,

        existingDocumentIds,

      );



    if (

      !hasAtLeastOneProductPerformanceContent({

        testReports: hasTestReportsPayload ? testReports : undefined,

        uploadedFiles: uploadFiles,

        retainedDocumentCount,

      })

    ) {

      throw new BadRequestException(PRODUCT_PERFORMANCE_EMPTY_FORM_MESSAGE);

    }



    const { payload, filesUploaded } =

      await this.processRenewProductPerformanceService.save(

        {

          urnNo,

          renewalCycleId,

          eoiNo: body.eoiNo ? String(body.eoiNo) : undefined,

          productPerformanceStatus:

            body.productPerformanceStatus !== undefined &&

            body.productPerformanceStatus !== ''

              ? parseInt(String(body.productPerformanceStatus), 10)

              : undefined,

          renewalType:

            body.renewalType !== undefined && body.renewalType !== ''

              ? parseInt(String(body.renewalType), 10)

              : undefined,

          testReports: hasTestReportsPayload ? testReports : undefined,

          existingDocumentIds,

        },

        uploadFiles,

      );



    const publicTestReports = toPublicRenewTestReports(

      (payload.testReports as Array<{

        productName: string;

        testReportFileName: string;

        eoiNo?: string;

      }>) ?? [],

    );



    return {

      success: true,

      message: 'Product performance saved successfully',

      data: {

        urnNo: payload.urnNo,

        renewalCycleId: payload.renewalCycleId,

        productPerformanceStatus: payload.productPerformanceStatus,

        renewalType: payload.renewalType,

        testReportFiles: payload.testReportFiles,

        testReports: publicTestReports,

        updatedDate: payload.updatedDate,

      },

      meta: {

        filesUploaded,

        testReports: publicTestReports,

      },

    };

  }



  @Get(':urnNo')

  @ApiOperation({

    summary: 'Full renewal product performance form payload',

    description:

      'Authoritative testReports and documents for urnNo + renewalCycleId (defaults to cycle with saved data, else active in-progress cycle).',

  })

  @ApiParam({ name: 'urnNo', type: String })

  @ApiQuery({ name: 'renewalCycleId', required: false, type: String })

  @ApiResponse({ status: 200, description: 'Full product performance form payload' })

  async listByUrn(

    @CurrentUser() user: any,

    @Param('urnNo') urnNo: string,

    @Query('renewalCycleId') renewalCycleId?: string,

  ) {

    await assertRenewProcessActorCanReadUrn(this.productModel, user, urnNo);

    const data =
      await this.processRenewProductPerformanceService.getFormPayloadByUrn(
        urnNo,
        renewalCycleId,
      );

    return {

      success: true,

      message: 'Renew product performance fetched successfully',

      data,

    };

  }

}

