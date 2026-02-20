import {
  Controller,
  Put,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

const storage = diskStorage({
  destination: './uploads/manufacturers',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `manufacturer-${uniqueSuffix}${ext}`);
  },
});

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('manufacturers/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('manufacturer_image', {
      storage,
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(null, true);
          return;
        }
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only images are allowed.'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiOperation({
    summary: 'Update manufacturer details',
    description:
      'Updates manufacturer details including name, GP internal ID, and initial. Supports optional image upload.',
  })
  @ApiParam({ name: 'id', description: 'Manufacturer ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        manufacturerName: {
          type: 'string',
          description: 'Manufacturer name',
        },
        gpInternalId: {
          type: 'string',
          description: 'GP Internal ID (format: 3-5 uppercase letters + "-" + 3 digits, e.g., GPSC-312)',
          example: 'GPSC-312',
        },
        manufacturerInitial: {
          type: 'string',
          description: 'Manufacturer initial',
        },
        manufacturer_image: {
          type: 'string',
          format: 'binary',
          description: 'Manufacturer image (optional)',
        },
      },
      required: ['manufacturerName', 'gpInternalId', 'manufacturerInitial'],
    },
  })
  @ApiResponse({ status: 200, description: 'Manufacturer updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or format' })
  @ApiResponse({ status: 404, description: 'Manufacturer not found' })
  async updateManufacturer(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    },
  ) {
    const updateDto = plainToClass(UpdateManufacturerDto, {
      manufacturerName: body.manufacturerName,
      gpInternalId: body.gpInternalId,
      manufacturerInitial: body.manufacturerInitial,
    });

    const errors = await validate(updateDto);
    if (errors.length > 0) {
      const errorMessages = errors.map((error) => Object.values(error.constraints || {})).flat();
      throw new BadRequestException(errorMessages.join(', '));
    }

    const imagePath = file ? `/uploads/manufacturers/${file.filename}` : undefined;
    const manufacturer = await this.adminService.updateManufacturer(
      id,
      updateDto,
      imagePath,
    );
    return {
      message: 'Manufacturer updated successfully',
      data: manufacturer,
    };
  }

  @Patch('manufacturers/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Toggle manufacturer status',
    description: 'Toggles manufacturer status: if current status is 1, sets to 2; if 2, sets to 1',
  })
  @ApiParam({ name: 'id', description: 'Manufacturer ID' })
  @ApiResponse({ status: 200, description: 'Manufacturer status updated successfully' })
  @ApiResponse({ status: 404, description: 'Manufacturer not found' })
  async updateManufacturerStatus(@Param('id') id: string) {
    const manufacturer = await this.adminService.updateManufacturerStatus(id);
    return {
      message: 'Manufacturer status updated successfully',
      data: manufacturer,
    };
  }

  @Patch('vendors/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Toggle vendor status',
    description: 'Toggles vendor status: if current status is 0, sets to 1; if 1, sets to 0',
  })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  @ApiResponse({ status: 200, description: 'Vendor status updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async updateVendorStatus(@Param('id') id: string) {
    const vendor = await this.adminService.updateVendorStatus(id);
    return {
      message: 'Vendor status updated successfully',
      data: vendor,
    };
  }
}
