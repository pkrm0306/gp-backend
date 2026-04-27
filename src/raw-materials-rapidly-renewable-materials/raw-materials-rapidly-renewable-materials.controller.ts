import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RawMaterialsRapidlyRenewableMaterialsService } from './raw-materials-rapidly-renewable-materials.service';
import { CreateRawMaterialsRapidlyRenewableMaterialsDto } from './dto/create-raw-materials-rapidly-renewable-materials.dto';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const tempDir = './uploads/temp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `temp-${uniqueSuffix}${ext}`);
  },
});

@ApiTags('Raw Materials Rapidly Renewable Materials')
@Controller('raw-materials-rapidly-renewable-materials')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsRapidlyRenewableMaterialsController {
  constructor(
    private readonly service: RawMaterialsRapidlyRenewableMaterialsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials rapidly renewable materials units (per URN)',
  })
  @UseInterceptors(
    AnyFilesInterceptor({
      storage,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo', 'units'],
      properties: {
        urnNo: { type: 'string', example: 'URN-20260305124230' },
        vendorId: { type: 'string', example: '66f1abcdef1234567890abcd' },
        rapidlyRenewableFileName: {
          type: 'string',
          example: 'Rapidly Renewable Supporting Document - 2026',
        },
        units: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  unitName: { type: 'string', example: 'Test Unit 1' },
                  year: { type: 'number', example: 2024 },
                  unit1: { type: 'number', example: 1 },
                  yeardata1: { type: 'number', example: 10 },
                  unit2: { type: 'number', example: 1 },
                  yeardata2: { type: 'number', example: 5 },
                },
              },
            },
            {
              type: 'string',
              description: 'JSON stringified units array for multipart/form-data',
            },
          ],
        },
        rapidlyRenewableFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            urnNo: { type: 'string', example: 'URN-XXXX' },
            vendorId: { type: 'string', example: '66f1abcdef1234567890abcd' },
            units: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  rawMaterialsRapidlyRenewableMaterialsId: { type: 'number', example: 101 },
                  unitName: { type: 'string', example: 'Test Unit 1' },
                  year: { type: 'number', example: 2024 },
                  unit1: { type: 'number', example: 1 },
                  yeardata1: { type: 'number', example: 10 },
                  unit2: { type: 'number', example: 1 },
                  yeardata2: { type: 'number', example: 5 },
                  yeardata3: { type: 'number', example: 50 },
                },
              },
            },
            documents: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
      },
    },
  })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFiles() uploadedFiles?: Express.Multer.File[],
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    let units = body.units;
    if (typeof body.units === 'string') {
      try {
        units = JSON.parse(body.units);
      } catch {
        throw new BadRequestException('Invalid units format. Expected JSON array.');
      }
    }
    if (!Array.isArray(units) || units.length === 0) {
      throw new BadRequestException('units must be a non-empty array');
    }

    const preferredFieldNames = [
      'rapidlyRenewableFile',
      'file',
      'supportingDocument',
      'document',
    ];
    const rapidlyRenewableFile =
      uploadedFiles?.find((f) => preferredFieldNames.includes(f.fieldname)) ??
      uploadedFiles?.[0];

    const dto: CreateRawMaterialsRapidlyRenewableMaterialsDto = {
      urnNo: body.urnNo,
      vendorId: body.vendorId,
      rapidlyRenewableFileName: body.rapidlyRenewableFileName,
      units,
    };

    if (
      rapidlyRenewableFile &&
      (!dto.rapidlyRenewableFileName || dto.rapidlyRenewableFileName.trim() === '')
    ) {
      throw new BadRequestException(
        'rapidlyRenewableFileName is required when uploading rapidlyRenewableFile',
      );
    }

    const data = await this.service.create(dto, user.vendorId, rapidlyRenewableFile);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'Get all raw materials rapidly renewable materials units by URN',
  })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            urnNo: { type: 'string', example: 'URN-XXXX' },
            vendorId: { type: 'string', example: '66f1abcdef1234567890abcd' },
            units: { type: 'array', items: { type: 'object' } },
            documents: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
  })
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
