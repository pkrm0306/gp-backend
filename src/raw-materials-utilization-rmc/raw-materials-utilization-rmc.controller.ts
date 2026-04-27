import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
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
import { RawMaterialsUtilizationRmcService } from './raw-materials-utilization-rmc.service';

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

@ApiTags('Raw Materials Utilization RMC')
@Controller('raw-materials-utilization-rmc')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsUtilizationRmcController {
  constructor(private readonly service: RawMaterialsUtilizationRmcService) {}

  @Post()
  @ApiOperation({
    summary: 'Create raw materials utilization RMC record (per URN)',
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
      properties: {
        urnNo: { type: 'string', example: 'URN-20260305124230' },
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
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFiles() uploadedFiles?: Express.Multer.File[],
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    if (!body?.urnNo || String(body.urnNo).trim() === '') {
      throw new BadRequestException('URN number is required');
    }

    const file1 =
      uploadedFiles?.find((f) =>
        ['utilizationRmcFile', 'step15File1', 'rawMaterials3151File'].includes(f.fieldname),
      ) ?? uploadedFiles?.[0];
    const file2 = uploadedFiles?.find((f) =>
      ['utilizationRmcFile2', 'step15File2', 'rawMaterials3152File'].includes(f.fieldname),
    );

    const data = await this.service.create(body, user.vendorId, { file1, file2 });
    return { success: true, data };
  }

  @Put(':urnNo')
  @ApiOperation({ summary: 'Upsert raw materials step-15 payload by URN' })
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
  async upsertByUrn(
    @CurrentUser() user: any,
    @Param('urnNo') urnNo: string,
    @Body() body: any,
    @UploadedFiles() uploadedFiles?: Express.Multer.File[],
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    if (!urnNo || urnNo.trim() === '') {
      throw new BadRequestException('URN number is required');
    }

    const file1 =
      uploadedFiles?.find((f) =>
        ['utilizationRmcFile', 'step15File1', 'rawMaterials3151File'].includes(f.fieldname),
      ) ?? uploadedFiles?.[0];
    const file2 = uploadedFiles?.find((f) =>
      ['utilizationRmcFile2', 'step15File2', 'rawMaterials3152File'].includes(f.fieldname),
    );

    const data = await this.service.create(body, user.vendorId, { file1, file2 }, urnNo.trim());
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List raw materials utilization RMC records by URN',
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
