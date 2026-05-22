import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { certificationMultipartMemoryMulterOptions } from '../common/upload/multer-universal.config';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RawMaterialsReduceEnvironmentalService } from './raw-materials-reduce-environmental.service';
import { CreateRawMaterialsReduceEnvironmentalDto } from './dto/create-raw-materials-reduce-environmental.dto';
import {
  assertAtLeastOneRawMaterialsField,
  assertRawMaterialsDocumentTypes,
  collectAllUploadFiles,
  parseRawMaterialsFormString,
  parseRequiredRawMaterialsUrn,
  pickUploadFile,
  resolveReduceEnvironmentalUnits,
} from '../common/raw-materials/raw-materials-upload.util';

const QUARRYING_UNIT_ROW_KEYS = [
  'location',
  'enhancementOfMinesLife',
  'topsoilConservation',
  'waterTableManagement',
  'restorationOfSpentMines',
  'greenBeltDevelopmentAndBioDiversity',
];

@ApiTags('Raw Materials Reduce Environmental')
/** Vendor portal uses legacy typo `enviromental`; keep both paths. */
@Controller([
  'raw-materials-reduce-environmental',
  'raw-materials-reduce-enviromental',
])
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsReduceEnvironmentalController {
  constructor(
    private readonly service: RawMaterialsReduceEnvironmentalService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials reduce environmental record (per URN)',
    description:
      'Accepts multipart or JSON. `units` / `mines` arrays replace rows for the URN; flat `location` (or `locations`) is used when arrays are empty.',
  })
  @UseInterceptors(
    AnyFilesInterceptor(certificationMultipartMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo'],
      properties: {
        urnNo: { type: 'string', example: 'URN-20260305124230' },
        units: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  location: { type: 'string', example: 'Mine site location details' },
                  locations: { type: 'string', example: 'Mine site location (alias)' },
                  enhancementOfMinesLife: {
                    type: 'string',
                    example: 'Measures for enhancement of mines life',
                  },
                  topsoilConservation: {
                    type: 'string',
                    example: 'Topsoil conservation measures',
                  },
                  waterTableManagement: {
                    type: 'string',
                    example: 'Water table management measures',
                  },
                  restorationOfSpentMines: {
                    type: 'string',
                    example: 'Restoration plan details',
                  },
                  greenBeltDevelopmentAndBioDiversity: {
                    type: 'string',
                    example: 'Green belt development and biodiversity initiatives',
                  },
                },
              },
            },
            {
              type: 'string',
              description: 'JSON stringified units array for multipart/form-data',
            },
          ],
        },
        mines: {
          type: 'string',
          description: 'Optional JSON array alias used by some vendor builds',
        },
        location: { type: 'string', example: 'Mine site location details' },
        locations: { type: 'string', example: 'Mine site location (alias)' },
        enhancementOfMinesLife: { type: 'string', example: 'Measures for enhancement of mines life' },
        topsoilConservation: { type: 'string', example: 'Topsoil conservation measures' },
        waterTableManagement: { type: 'string', example: 'Water table management measures' },
        restorationOfSpentMines: { type: 'string', example: 'Restoration plan details' },
        greenBeltDevelopmentAndBioDiversity: {
          type: 'string',
          example: 'Green belt development and biodiversity initiatives',
        },
        reduceEnvironmentalFileName: {
          type: 'string',
          example: 'Reduce Environmental Supporting Document - 2026',
        },
        reduceEnvironmentalFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(@CurrentUser() user: any, @Req() req: Request) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const uploadedFiles = collectAllUploadFiles(
      req.files as Express.Multer.File[] | undefined,
    );
    const reduceEnvironmentalFile = pickUploadFile(uploadedFiles, [
      'reduceEnvironmentalFile',
      'file',
      'supportingDocument',
      'document',
    ]);

    const resolvedUnits = resolveReduceEnvironmentalUnits(
      body,
      QUARRYING_UNIT_ROW_KEYS,
    );

    if (reduceEnvironmentalFile) {
      assertRawMaterialsDocumentTypes([reduceEnvironmentalFile]);
    }
    assertAtLeastOneRawMaterialsField({
      files: reduceEnvironmentalFile ? [reduceEnvironmentalFile] : [],
      rows: resolvedUnits,
      rowKeys: QUARRYING_UNIT_ROW_KEYS,
    });

    const first = resolvedUnits[0];
    const dto: CreateRawMaterialsReduceEnvironmentalDto = {
      urnNo: parseRequiredRawMaterialsUrn(body),
      units: resolvedUnits,
      location: first?.location,
      enhancementOfMinesLife: first?.enhancementOfMinesLife,
      topsoilConservation: first?.topsoilConservation,
      waterTableManagement: first?.waterTableManagement,
      restorationOfSpentMines: first?.restorationOfSpentMines,
      greenBeltDevelopmentAndBioDiversity: first?.greenBeltDevelopmentAndBioDiversity,
      reduceEnvironmentalFileName:
        parseRawMaterialsFormString(body.reduceEnvironmentalFileName) ?? undefined,
    };
    const data = await this.service.create(
      dto,
      user.vendorId,
      reduceEnvironmentalFile,
    );
    return {
      success: true,
      message: 'Reduce environmental quarrying details saved successfully',
      data,
    };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List raw materials reduce environmental records by URN',
  })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  async listByUrn(@CurrentUser() user: any, @Param('urn_no') urnNo: string) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    if (!urnNo || urnNo.trim() === '') {
      throw new BadRequestException('URN number is required');
    }
    const data = await this.service.listByUrn(urnNo.trim(), user.vendorId);
    return { success: true, data };
  }
}
