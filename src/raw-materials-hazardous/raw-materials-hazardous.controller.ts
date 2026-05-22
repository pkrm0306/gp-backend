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
import {
  assertAtLeastOneRawMaterialsField,
  parseRawMaterialsFormString,
  parseRequiredRawMaterialsUrn,
} from '../common/raw-materials/raw-materials-upload.util';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RawMaterialsHazardousService } from './raw-materials-hazardous.service';
import { CreateRawMaterialsHazardousDto } from './dto/create-raw-materials-hazardous.dto';

@ApiTags('Raw Materials Hazardous')
@Controller('raw-materials-hazardous')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsHazardousController {
  constructor(private readonly service: RawMaterialsHazardousService) {}

  @Post()
  @ApiOperation({
    summary: 'Save raw materials hazardous details (Step 1 textarea, per URN)',
    description:
      'Accepts **multipart/form-data** (vendor default) or JSON. Fields: `urnNo` (required), `eoiNo` (optional), `details` (optional). Upserts by URN + vendor.',
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
        urnNo: { type: 'string', example: 'URN-20260520013725' },
        eoiNo: { type: 'string', example: 'GPPMI003014' },
        details: {
          type: 'string',
          example: 'Details of the test carried out for hazardous substances.',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Saved successfully' })
  async create(@CurrentUser() user: any, @Req() req: Request) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const urnNo = parseRequiredRawMaterialsUrn(body);
    const eoiNo = parseRawMaterialsFormString(body.eoiNo)?.trim() || undefined;
    const details = parseRawMaterialsFormString(body.details) ?? '';

    assertAtLeastOneRawMaterialsField({
      textValues: [details, eoiNo],
    });

    const dto: CreateRawMaterialsHazardousDto = {
      urnNo,
      eoiNo,
      details,
    };

    const data = await this.service.create(dto, user.vendorId);
    return {
      success: true,
      message: 'Hazardous details saved successfully',
      data: {
        urnNo: data.urnNo,
        eoiNo: data.eoiNo ?? '',
        details: data.details ?? '',
      },
    };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List raw materials hazardous records by URN',
  })
  @ApiParam({ name: 'urn_no', example: 'URN-20260520013725' })
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
