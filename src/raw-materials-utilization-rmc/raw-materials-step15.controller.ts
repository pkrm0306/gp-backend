import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
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

@ApiTags('Raw Materials Step 15')
@Controller('vendor/raw-materials/step-15')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsStep15Controller {
  constructor(private readonly service: RawMaterialsUtilizationRmcService) {}

  @Put(':urnNo')
  @ApiOperation({ summary: 'Upsert Step-15 raw materials payload' })
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
  async upsert(
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
}
