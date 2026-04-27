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
import { RawMaterialsEliminationOfProhibitedFlameService } from './raw-materials-elimination-of-prohibited-flame.service';
import { CreateRawMaterialsEliminationOfProhibitedFlameDto } from './dto/create-raw-materials-elimination-of-prohibited-flame.dto';

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

@ApiTags('Raw Materials Elimination Of Prohibited Flame')
@Controller('raw-materials-elimination-of-prohibited-flame')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsEliminationOfProhibitedFlameController {
  constructor(
    private readonly service: RawMaterialsEliminationOfProhibitedFlameService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create raw materials elimination of prohibited flame record (per URN)',
  })
  @UseInterceptors(
    FileInterceptor('prohibitedFlameFile', {
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
        measuresImplemented: {
          type: 'string',
          example: 'Removed prohibited flame retardants and replaced with compliant alternatives.',
        },
        prohibitedFlameFileName: {
          type: 'string',
          example: 'Prohibited Flame Elimination Supporting Document - 2026',
        },
        prohibitedFlameFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFile() prohibitedFlameFile?: Express.Multer.File,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const dto: CreateRawMaterialsEliminationOfProhibitedFlameDto = {
      urnNo: body.urnNo,
      measuresImplemented: body.measuresImplemented,
      prohibitedFlameFileName: body.prohibitedFlameFileName,
    };
    const data = await this.service.create(dto, user.vendorId, prohibitedFlameFile);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary:
      'List raw materials elimination of prohibited flame records by URN',
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
