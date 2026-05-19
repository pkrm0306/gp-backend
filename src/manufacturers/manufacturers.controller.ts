import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Put,
  Query,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ManufacturersService } from './manufacturers.service';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { ListManufacturersQueryDto } from './dto/list-manufacturers-query.dto';
import { UpdateVendorStatusDto } from './dto/update-vendor-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { manufacturerImageMulterOptions } from './manufacturer-image-upload.config';
import { uploadFile } from '../utils/upload-file.util';

@ApiTags('Manufacturers')
@Controller('api/manufacturers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Get('export')
  @ApiOperation({
    summary: 'Export manufacturers (CSV or Excel)',
    description:
      'Same filters and sort as the paginated list (search, manufacturerName, gpInternalId, manufacturerInitial, manufacturerStatus, vendor_status, sortBy, order). Omits pagination and returns every matching row. Optional `id` exports a single manufacturer. Use `format=xlsx` for an Excel workbook that includes **Initial** and **Status** (On/Off) like the admin grid; default `format=csv`.',
  })
  @ApiResponse({ status: 200, description: 'CSV or XLSX download' })
  async exportFile(@Query() query: ListManufacturersQueryDto) {
    const format = query.format ?? 'csv';
    if (format === 'xlsx') {
      const { buffer, fileName } =
        await this.manufacturersService.buildXlsxExport(query);
      return new StreamableFile(buffer, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: `attachment; filename="${fileName}"`,
      });
    }
    const csv = await this.manufacturersService.buildCsvExport(query);
    const buf = Buffer.from(csv, 'utf-8');
    return new StreamableFile(buf, {
      type: 'text/csv; charset=utf-8',
      disposition: 'attachment; filename="manufacturers-export.csv"',
    });
  }

  @Get()
  @ApiOperation({
    summary: 'List manufacturers (paginated)',
    description:
      'Pagination (`page`, `limit`) with filters: **gpInternalId** (manufacturer ID), **manufacturerInitial** (initial), **manufacturerName** (name), **search** (global). ' +
      'For the **verified manufacturers** screen use `scope=verified` and optional **status** multiselect: `active` (vendor on) / `inactive` (vendor off) — comma-separated or repeated, e.g. `status=active` or `status=active,inactive`. ' +
      'Legacy numeric filter: `vendor_status` or `vendor_status_list=0,1`. Sort: `sortBy`, `order`. Requires JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list with total, page, limit',
  })
  async findAll(@Query() query: ListManufacturersQueryDto) {
    if (query.id) {
      const manufacturer = await this.manufacturersService.findById(query.id);
      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      return {
        message: 'Manufacturer retrieved successfully',
        data: manufacturer,
      };
    }
    return this.manufacturersService.findAllPaginated(query);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'manufacturer_image', maxCount: 1 },
      ],
      manufacturerImageMulterOptions(),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Update manufacturer',
    description:
      'Updates manufacturer name (required). **gpInternalId** / **manufacturerInitial** are auto-generated while the manufacturer is **unverified**; optional for verified. Optional vendor fields and image.',
  })
  @ApiParam({ name: 'id', description: 'Manufacturer MongoDB id' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['manufacturerName'],
      properties: {
        manufacturerName: { type: 'string' },
        gpInternalId: {
          type: 'string',
          description: 'Optional when verified; ignored when unverified (auto).',
          example: 'GPGP-001',
        },
        manufacturerInitial: {
          type: 'string',
          description: 'Optional when verified; ignored when unverified (auto).',
        },
        vendor_name: { type: 'string' },
        vendor_email: { type: 'string' },
        vendor_phone: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Manufacturer image (optional)',
        },
        manufacturer_image: {
          type: 'string',
          format: 'binary',
          description: 'Alternative image field name (optional)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Manufacturer updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Manufacturer not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateManufacturerDto,
    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      manufacturer_image?: Express.Multer.File[];
    },
  ) {
    const image = files?.image?.[0] ?? files?.manufacturer_image?.[0];
    const imagePath = image
      ? (await uploadFile(image, 'manufacturers')).fileUrl
      : undefined;
    const data = await this.manufacturersService.updateManufacturerDetails(
      id,
      dto,
      imagePath,
    );
    return { message: 'Manufacturer updated successfully', data };
  }

  @Patch(':id/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify unverified manufacturer',
    description: 'Sets manufacturerStatus=1 and vendor_status=1.',
  })
  @ApiParam({ name: 'id', description: 'Manufacturer MongoDB id' })
  @ApiResponse({ status: 200, description: 'Manufacturer verified' })
  async verify(@Param('id') id: string) {
    const data = await this.manufacturersService.verifyManufacturer(id);
    return { message: 'Manufacturer verified successfully', data };
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change manufacturer status',
    description:
      'Supports: (1) manufacturerStatus=1 -> verifies manufacturer and sets vendor_status=1, (2) vendor_status=0/1 -> sets vendor status for verified manufacturer, (3) empty body -> toggles vendor_status between 0/1 while keeping manufacturerStatus=1.',
  })
  @ApiParam({ name: 'id', description: 'Manufacturer MongoDB id' })
  @ApiBody({ type: UpdateVendorStatusDto, required: false })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Manufacturer not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto?: Partial<UpdateVendorStatusDto>,
  ) {
    if (dto?.manufacturerStatus === 1) {
      if (dto.vendor_status === 0) {
        throw new BadRequestException(
          'When manufacturerStatus is set to 1, vendor_status cannot be 0',
        );
      }
      const data = await this.manufacturersService.verifyManufacturer(id);
      return { message: 'Manufacturer status updated successfully', data };
    }

    const data =
      dto?.vendor_status === 0 || dto?.vendor_status === 1
        ? await this.manufacturersService.setVendorStatusForVerified(
            id,
            dto.vendor_status,
          )
        : await this.manufacturersService.toggleManufacturerStatus(id);
    return { message: 'Manufacturer status updated successfully', data };
  }

  @Patch(':id/vendor-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update vendor active/inactive (verified only)',
    description:
      'Lightweight status update for verified manufacturers. manufacturerStatus stays 1; only vendor_status changes (0/1).',
  })
  @ApiParam({ name: 'id', description: 'Manufacturer MongoDB id' })
  @ApiBody({ type: UpdateVendorStatusDto })
  @ApiResponse({ status: 200, description: 'Vendor status updated' })
  @ApiResponse({ status: 400, description: 'Validation / business rule error' })
  @ApiResponse({ status: 404, description: 'Manufacturer not found' })
  async updateVendorStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVendorStatusDto,
  ) {
    const data = await this.manufacturersService.setVendorStatusForVerified(
      id,
      dto.vendor_status,
    );
    return {
      message: 'Vendor status updated',
      data: { _id: data._id, vendor_status: data.vendor_status },
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete verified manufacturer with constraints',
    description:
      'Delete is blocked when manufacturer_product_count > 0 or manufacturer_vendor_count > 0.',
  })
  @ApiParam({ name: 'id', description: 'Manufacturer MongoDB id' })
  async remove(@Param('id') id: string) {
    const data =
      await this.manufacturersService.deleteManufacturerWithConstraint(id);
    return { message: 'Manufacturer deleted successfully', data };
  }
}
