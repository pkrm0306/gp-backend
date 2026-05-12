import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { RawMaterialsOptimizationOfRawMixService } from './raw-materials-optimization-of-raw-mix.service';
import { CreateRawMaterialsOptimizationOfRawMixDto } from './dto/create-raw-materials-optimization-of-raw-mix.dto';

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

@ApiTags('Raw Materials Optimization Of Raw Mix')
@Controller('raw-materials-optimization-of-raw-mix')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsOptimizationOfRawMixController {
  constructor(
    private readonly service: RawMaterialsOptimizationOfRawMixService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials optimization of raw mix record (per URN)',
  })
  @UseInterceptors(
    FileInterceptor('optimizationOfRawMixFile', {
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
        optimizationOfRawMixFileName: {
          type: 'string',
          example: 'Raw Mix Optimization Supporting Document - 2026',
        },
        units: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  unitName: { type: 'string', example: 'Unit A' },
                  year: { type: 'number', example: 2026 },
                  yeardata1: { type: 'number', example: 10 },
                  yeardata2: { type: 'number', example: 20 },
                  yeardata3: { type: 'number', example: 30 },
                },
              },
            },
            {
              type: 'string',
              description: 'JSON stringified units array for multipart/form-data',
            },
          ],
        },
        optimizationOfRawMixFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFile() optimizationOfRawMixFile?: Express.Multer.File,
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

    const dto: CreateRawMaterialsOptimizationOfRawMixDto = {
      urnNo: body.urnNo,
      units,
      optimizationOfRawMixFileName: body.optimizationOfRawMixFileName,
    };

    const data = await this.service.create(dto, user.vendorId, optimizationOfRawMixFile);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List raw materials optimization of raw mix records by URN',
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
