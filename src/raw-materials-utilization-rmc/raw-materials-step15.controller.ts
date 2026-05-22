import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  assertRawMaterialsDocumentTypes,
  parseRequiredRawMaterialsUrn,
  rawMaterialsMultipartMemoryMulterOptions,
} from '../common/raw-materials/raw-materials-upload.util';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RawMaterialsUtilizationRmcService } from './raw-materials-utilization-rmc.service';

@ApiTags('Raw Materials Step 15')
@Controller('vendor/raw-materials/step-15')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsStep15Controller {
  constructor(
    private readonly service: RawMaterialsUtilizationRmcService,
    private readonly stepGate: RawMaterialsStepGateService,
  ) {}

  @Put(':urnNo')
  @ApiOperation({ summary: 'Upsert Step-15 raw materials payload' })
  @UseInterceptors(
    AnyFilesInterceptor(rawMaterialsMultipartMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        utilizationRmcFileName: {
          type: 'string',
          example: 'RMC Utilization Supporting Document - 2026',
        },
        utilizationRmcFile: { type: 'string', format: 'binary' },
        utilizationRmcFile2: { type: 'string', format: 'binary' },
      },
      additionalProperties: true,
    },
  })
  async upsert(
    @CurrentUser() user: any,
    @Param('urnNo') urnNoParam: string,
    @Body() body: any,
    @UploadedFiles() uploadedFiles?: Express.Multer.File[],
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const urnNo = parseRequiredRawMaterialsUrn({
      urnNo: urnNoParam?.trim() || body?.urnNo,
    });

    const file1 =
      uploadedFiles?.find((f) =>
        ['utilizationRmcFile', 'step15File1', 'rawMaterials3151File'].includes(
          f.fieldname,
        ),
      ) ?? uploadedFiles?.[0];
    const file2 = uploadedFiles?.find((f) =>
      ['utilizationRmcFile2', 'step15File2', 'rawMaterials3152File'].includes(
        f.fieldname,
      ),
    );
    const uploadFiles = [file1, file2].filter(Boolean) as Express.Multer.File[];
    if (uploadFiles.length) {
      assertRawMaterialsDocumentTypes(uploadFiles);
    }

    const persistedRecordCount = await this.service.countPersistedByUrn(
      urnNo,
      user.vendorId,
    );

    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm:
        DocumentSectionKey.RAW_MATERIALS_RMC_ALTERNATIVE_RAW_MATERIALS,
      files: uploadFiles,
      persistedRecordCount,
      multipartBody: body ?? {},
    });

    const data = await this.service.create(
      body,
      user.vendorId,
      { file1, file2 },
      urnNo,
    );
    return {
      success: true,
      message: 'Raw materials step 15 saved successfully',
      data,
    };
  }
}
