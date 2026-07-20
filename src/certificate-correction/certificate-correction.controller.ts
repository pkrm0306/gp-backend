import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import {
  PRODUCTS_CERTIFICATE_CORRECTION_UPDATE_ANY,
  PRODUCTS_CERTIFICATE_CORRECTION_VIEW_ANY,
} from '../common/constants/permissions.constants';
import { CertificateCorrectionService } from './certificate-correction.service';
import { UpdateCertificateCorrectionDto } from './dto/update-certificate-correction.dto';

@ApiTags('Admin Certificate Correction')
@Controller('api/admin/certificate-correction')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class CertificateCorrectionController {
  constructor(
    private readonly certificateCorrectionService: CertificateCorrectionService,
  ) {}

  @Get('meta')
  @AnyPermissions(...PRODUCTS_CERTIFICATE_CORRECTION_VIEW_ANY)
  @ApiOperation({
    summary: 'States + manufacturers for certificate correction form',
  })
  @ApiResponse({ status: 200, description: 'Meta loaded' })
  async meta() {
    const data = await this.certificateCorrectionService.getMeta();
    return { success: true, data };
  }

  @Get('by-eoi/:eoiNo')
  @AnyPermissions(...PRODUCTS_CERTIFICATE_CORRECTION_VIEW_ANY)
  @ApiOperation({ summary: 'Load certified product + plants by EOI' })
  @ApiParam({ name: 'eoiNo' })
  @ApiResponse({ status: 200, description: 'Product loaded' })
  @ApiResponse({ status: 404, description: 'EOI number not found!' })
  async byEoi(@Param('eoiNo') eoiNo: string) {
    const data = await this.certificateCorrectionService.getByEoi(eoiNo);
    return { success: true, data };
  }

  @Put()
  @AnyPermissions(...PRODUCTS_CERTIFICATE_CORRECTION_UPDATE_ANY)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update product + plant certificate fields' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 400, description: 'Validation / duplicate EOI' })
  async update(@Body() dto: UpdateCertificateCorrectionDto) {
    return this.certificateCorrectionService.update(dto);
  }

  @Get('preview/:eoiNo')
  @AnyPermissions(...PRODUCTS_CERTIFICATE_CORRECTION_VIEW_ANY)
  @ApiOperation({
    summary: 'Regenerate and stream certificate PDF for EOI',
  })
  @ApiParam({ name: 'eoiNo' })
  async preview(
    @Param('eoiNo') eoiNo: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = await this.certificateCorrectionService.previewPdf(eoiNo);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${file.fileName}"`,
    );
    return new StreamableFile(file.buffer, {
      type: file.contentType,
      disposition: `inline; filename="${file.fileName}"`,
    });
  }
}
