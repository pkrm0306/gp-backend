import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProductRegistrationService } from './product-registration.service';
import { AdminListProductsDto } from './dto/admin-list-products.dto';

@ApiTags('Admin Products')
@Controller('api/admin/products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminProductsController {
  constructor(private readonly productRegistrationService: ProductRegistrationService) {}

  @Post('list')
  @ApiOperation({
    summary: 'Unified product lifecycle listing',
    description:
      'Single listing endpoint for all admin product lifecycle tabs using filters only.',
  })
  @ApiBody({ type: AdminListProductsDto })
  @ApiResponse({ status: 200, description: 'Products listed successfully' })
  @HttpCode(HttpStatus.OK)
  async list(@Body() dto: AdminListProductsDto) {
    return this.productRegistrationService.adminListProducts(dto);
  }

  @Post('export')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiOperation({
    summary: 'Export admin products (Excel)',
    description:
      'Direct Excel download using same filters as list endpoint. Exports one row per EOI.',
  })
  @ApiBody({ type: AdminListProductsDto })
  @ApiResponse({ status: 200, description: 'Excel file download' })
  async export(@Body() dto: AdminListProductsDto): Promise<StreamableFile> {
    const file = await this.productRegistrationService.exportAdminProductsXlsx(dto);
    return new StreamableFile(file.buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${file.fileName}"`,
    });
  }
}

