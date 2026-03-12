import {
  Controller,
  Post,
  Get,
  Param,
  Body,
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
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RawMaterialsHazardousProductsService } from './raw-materials-hazardous-products.service';
import { CreateRawMaterialsHazardousProductsDto } from './dto/create-raw-materials-hazardous-products.dto';

// Temporary storage (service moves to URN folder)
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

@ApiTags('Raw Materials Hazardous Products')
@Controller('raw-materials-hazardous-products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsHazardousProductsController {
  constructor(private readonly service: RawMaterialsHazardousProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create hazardous products record (per URN)' })
  @UseInterceptors(
    FileInterceptor('productsTestReportFile', {
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
        productsName: { type: 'string', example: 'Hazardous chemical / raw material name' },
        productsTestReport: { type: 'string', example: 'Test report reference or summary' },
        productsTestReportFileName: { type: 'string', example: 'Hazardous Test Report - March 2026' },
        productsTestReportFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFile() productsTestReportFile?: Express.Multer.File,
  ) {
    if (!user?.vendorId) throw new BadRequestException('Vendor ID not found in token');

    const dto: CreateRawMaterialsHazardousProductsDto = {
      urnNo: body.urnNo,
      productsName: body.productsName,
      productsTestReport: body.productsTestReport,
      productsTestReportFileName: body.productsTestReportFileName,
    };

    if (productsTestReportFile && (!dto.productsTestReportFileName || dto.productsTestReportFileName.trim() === '')) {
      throw new BadRequestException('productsTestReportFileName is required when uploading productsTestReportFile');
    }

    const data = await this.service.create(dto, user.vendorId, productsTestReportFile);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({ summary: 'List hazardous products records by URN' })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  async listByUrn(@CurrentUser() user: any, @Param('urn_no') urnNo: string) {
    if (!user?.vendorId) throw new BadRequestException('Vendor ID not found in token');
    if (!urnNo || urnNo.trim() === '') throw new BadRequestException('URN number is required');
    const data = await this.service.listByUrn(urnNo.trim(), user.vendorId);
    return { success: true, data };
  }
}

