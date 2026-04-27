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
import { RawMaterialsAdditivesService } from './raw-materials-additives.service';
import { CreateRawMaterialsAdditivesDto } from './dto/create-raw-materials-additives.dto';

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

@ApiTags('Raw Materials Additives')
@Controller('raw-materials-additives')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsAdditivesController {
  constructor(private readonly service: RawMaterialsAdditivesService) {}

  @Post()
  @ApiOperation({ summary: 'Create raw materials additives record (per URN)' })
  @UseInterceptors(
    FileInterceptor('additivesFile', {
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
        additivesFileName: {
          type: 'string',
          example: 'Additives Supporting Document - 2026',
        },
        units: {
          oneOf: [
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  unitName: { type: 'string', example: 'Manufacturing Unit - A' },
                  year1: { type: 'number', example: 100 },
                  year1a: { type: 'number', example: 20 },
                  year1b: { type: 'number', example: 30 },
                  year1c: { type: 'number', example: 50 },
                  year2: { type: 'number', example: 110 },
                  year2a: { type: 'number', example: 25 },
                  year2b: { type: 'number', example: 35 },
                  year2c: { type: 'number', example: 50 },
                  year3: { type: 'number', example: 120 },
                  year3a: { type: 'number', example: 30 },
                  year3b: { type: 'number', example: 40 },
                  year3c: { type: 'number', example: 50 },
                  psc: { type: 'string', example: 'PSC description' },
                  coc: { type: 'string', example: 'COC description' },
                  percentcoc: { type: 'string', example: '15%' },
                },
              },
            },
            {
              type: 'string',
              description: 'JSON stringified units array for multipart/form-data',
            },
          ],
        },
        additivesFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFile() additivesFile?: Express.Multer.File,
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

    const dto: CreateRawMaterialsAdditivesDto = {
      urnNo: body.urnNo,
      units,
      additivesFileName: body.additivesFileName,
    };

    const data = await this.service.create(dto, user.vendorId, additivesFile);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({ summary: 'List raw materials additives records by URN' })
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
