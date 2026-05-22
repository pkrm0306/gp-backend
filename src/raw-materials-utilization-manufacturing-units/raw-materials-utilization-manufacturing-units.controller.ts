import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DocumentSectionKey } from '../common/constants/document-section-key.constants';
import { RawMaterialsStepGateService } from '../common/raw-materials/raw-materials-step-gate.service';
import { RawMaterialsUtilizationManufacturingUnitsService } from './raw-materials-utilization-manufacturing-units.service';
import { RawMaterialsUtilizationService } from '../raw-materials-utilization/raw-materials-utilization.service';
import { CreateRawMaterialsUtilizationManufacturingUnitsDto } from './dto/create-raw-materials-utilization-manufacturing-units.dto';
import {
  parseMultipartJsonArray,
  parseRequiredRawMaterialsUrn,
} from '../common/raw-materials/raw-materials-upload.util';

const MANUFACTURING_UNIT_ROW_KEYS = [
  'unitName',
  'year',
  'yeardata1',
  'yeardata2',
  'yeardata3',
];

@ApiTags('Raw Materials Utilization Manufacturing Units')
@Controller('raw-materials-utilization-manufacturing-units')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsUtilizationManufacturingUnitsController {
  constructor(
    private readonly service: RawMaterialsUtilizationManufacturingUnitsService,
    private readonly stepGate: RawMaterialsStepGateService,
    @Inject(forwardRef(() => RawMaterialsUtilizationService))
    private readonly utilizationService: RawMaterialsUtilizationService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create raw materials utilization manufacturing units record (per URN)',
  })
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
                  unitName: { type: 'string', example: 'Manufacturing Unit A' },
                  year: { type: 'number', example: 2026 },
                  yeardata1: { type: 'number', example: 10 },
                  yeardata2: { type: 'number', example: 20 },
                  yeardata3: { type: 'number', example: 30 },
                },
              },
            },
            {
              type: 'string',
              description: 'JSON stringified units array',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const urnNo = parseRequiredRawMaterialsUrn(body);
    const units = parseMultipartJsonArray(body.units, 'units');
    const [mfgCount, utilCount] = await Promise.all([
      this.service.countPersistedByUrn(urnNo, user.vendorId),
      this.utilizationService.countPersistedByUrn(urnNo, user.vendorId),
    ]);
    await this.stepGate.assertStepSubmitAllowed({
      vendorId: user.vendorId,
      urnNo,
      documentForm: DocumentSectionKey.RAW_MATERIALS_UTILIZATION,
      rows: units as Array<Record<string, unknown>>,
      rowKeys: MANUFACTURING_UNIT_ROW_KEYS,
      persistedRecordCount: mfgCount + utilCount,
    });

    const dto: CreateRawMaterialsUtilizationManufacturingUnitsDto = {
      urnNo,
      units: units as CreateRawMaterialsUtilizationManufacturingUnitsDto['units'],
    };

    const data = await this.service.create(dto, user.vendorId);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary:
      'List raw materials utilization manufacturing units records by URN',
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
