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
import { RawMaterialsReduceEnvironmentalService } from './raw-materials-reduce-environmental.service';
import { CreateRawMaterialsReduceEnvironmentalDto } from './dto/create-raw-materials-reduce-environmental.dto';

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

@ApiTags('Raw Materials Reduce Environmental')
@Controller('raw-materials-reduce-environmental')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsReduceEnvironmentalController {
  constructor(
    private readonly service: RawMaterialsReduceEnvironmentalService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials reduce environmental record (per URN)',
  })
  @UseInterceptors(
    FileInterceptor('reduceEnvironmentalFile', {
      storage,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
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
        location: { type: 'string', example: 'Mine site location details' },
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
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFile() reduceEnvironmentalFile?: Express.Multer.File,
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

    const dto: CreateRawMaterialsReduceEnvironmentalDto = {
      urnNo: body.urnNo,
      units,
      location: body.location,
      enhancementOfMinesLife: body.enhancementOfMinesLife,
      topsoilConservation: body.topsoilConservation,
      waterTableManagement: body.waterTableManagement,
      restorationOfSpentMines: body.restorationOfSpentMines,
      greenBeltDevelopmentAndBioDiversity: body.greenBeltDevelopmentAndBioDiversity,
      reduceEnvironmentalFileName: body.reduceEnvironmentalFileName,
    };
    const data = await this.service.create(dto, user.vendorId, reduceEnvironmentalFile);
    return { success: true, data };
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
