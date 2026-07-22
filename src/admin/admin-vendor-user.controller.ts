import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AllowAuthenticatedAdminPortalUser } from '../common/decorators/allow-authenticated-admin-portal-user.decorator';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { UpdateProfileDto } from '../manufacturers/dto/update-manufacturer-profile.dto';
import { vendorProfileBrandingMemoryMulterOptions } from '../manufacturers/vendor-profile-upload.config';

@ApiTags('Admin Vendor User')
@Controller('admin/vendor-user')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminVendorUserController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Get('profile')
  @AllowAuthenticatedAdminPortalUser()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get vendor user profile (admin portal)',
    description:
      'Returns vendor/company profile for the logged-in admin-portal user, resolved via vendor-users → manufacturer (same payload as GET /api/vendor/profile).',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getVendorUserProfile(@CurrentUser() user: { userId: string }) {
    const data = await this.manufacturersService.getVendorDetailsByAuthUserId(
      user.userId,
    );
    return { message: 'Vendor profile retrieved successfully', data };
  }

  @Patch('profile')
  @AllowAuthenticatedAdminPortalUser()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'gst', maxCount: 1 },
        { name: 'gstDocument', maxCount: 1 },
        { name: 'companyLogo', maxCount: 1 },
        { name: 'pan', maxCount: 1 },
        { name: 'panDocument', maxCount: 1 },
      ],
      vendorProfileBrandingMemoryMulterOptions(),
    ),
  )
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiOperation({
    summary: 'Update vendor user profile (admin portal)',
    description:
      'Updates vendor/company profile for the logged-in admin-portal user (same behavior as PATCH /api/vendor/profile). ' +
      'Supports JSON or multipart with optional GST, company logo, and PAN uploads.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateVendorUserProfile(
    @CurrentUser()
    user: {
      userId: string;
      manufacturerId?: string;
      vendorId?: string;
    },
    @Req() req: Request,
    @Body() updateDto: UpdateProfileDto,
    @UploadedFiles()
    files?: {
      gst?: Express.Multer.File[];
      gstDocument?: Express.Multer.File[];
      companyLogo?: Express.Multer.File[];
      pan?: Express.Multer.File[];
      panDocument?: Express.Multer.File[];
    },
  ) {
    const raw =
      typeof req.body === 'object' && req.body !== null && !Array.isArray(req.body)
        ? (req.body as Record<string, unknown>)
        : undefined;
    const data = await this.manufacturersService.editProfileWithOptionalBrandingFiles(
      user,
      updateDto,
      files,
      raw,
    );
    return { message: 'Profile updated successfully', data };
  }
}
