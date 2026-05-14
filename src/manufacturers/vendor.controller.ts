import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
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
import { ManufacturersService } from './manufacturers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-manufacturer-profile.dto';
import { UpdateVendorContactsDto } from './dto/update-vendor-contacts.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { vendorProfileBrandingMemoryMulterOptions } from './vendor-profile-upload.config';
import type { Request } from 'express';

@ApiTags('Vendor')
@Controller('api/vendor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post('profile/upload')
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
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload GST certificate and/or company logo',
    description:
      'Multipart: **gst** or **gstDocument** = one **PDF or JPEG** (GST certificate); **companyLogo** = one image (jpeg/png/gif/webp); **pan** or **panDocument** = one **PDF or JPEG** (PAN card scan). ' +
      'At least one file is required. Files are stored only through the shared **uploadFile()** helper in `src/utils/upload-file.util.ts` (local `uploads/manufacturers/` or S3 when configured).',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns updated profile payload (same shape as PATCH profile)',
  })
  async uploadVendorProfileBranding(
    @CurrentUser()
    user: {
      userId: string;
      manufacturerId?: string;
      vendorId?: string;
    },
    @UploadedFiles()
    files?: {
      gst?: Express.Multer.File[];
      gstDocument?: Express.Multer.File[];
      companyLogo?: Express.Multer.File[];
      pan?: Express.Multer.File[];
      panDocument?: Express.Multer.File[];
    },
  ) {
    const data = await this.manufacturersService.uploadVendorProfileBranding(
      user,
      files,
    );
    return { message: 'Vendor profile files updated successfully', data };
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get vendor details from manufacturer table (auth user based)',
    description:
      'Uses logged-in user id from JWT, resolves manufacturer mapping via vendor-users, and returns vendor details from manufacturer record. ' +
      'Includes **gstPdf**, **companyLogo**, **pan** (PAN document URL), and **panNumber** (PAN id text) when set.',
  })
  @ApiResponse({
    status: 200,
    description: 'Vendor details retrieved successfully',
  })
  async getVendorProfile(@CurrentUser() user: { userId: string }) {
    const data = await this.manufacturersService.getVendorDetailsByAuthUserId(
      user.userId,
    );
    return { message: 'Vendor details retrieved successfully', data };
  }

  @Patch('profile')
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
    summary: 'Update vendor profile (auth user based)',
    description:
      'Updates vendor/company fields on the linked **manufacturer** for the logged-in vendor user. ' +
      'Send **application/json** with URL fields, or **multipart/form-data** with the same text fields plus optional files. ' +
      'File fields: **gst** or **gstDocument** (**PDF or JPEG only**), **companyLogo** (image), **pan** or **panDocument** (**PDF or JPEG only**). If the form sends both **pan** and **panDocument**, use **panDocument** for the real file (an empty **pan** slot is ignored when **panDocument** has content). Uploaded files use the shared **uploadFile()** helper in `src/utils/upload-file.util.ts` (local or S3). ' +
      '**gst** (JSON): GST certificate document URL path or `https://…`; use **gstNumber** for GST id text. ' +
      'Alternatively use **POST /api/vendor/profile/upload** for file-only updates.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Vendor profile updated successfully',
  })
  async updateVendorProfile(
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
    return { message: 'Vendor profile updated successfully', data };
  }

  @Get('contacts')
  @ApiOperation({
    summary: 'Get technical and marketing contacts (vendor manufacturer)',
    description:
      'Returns **technicalContact** and **marketingContact**, each with **name**, **email_id**, **phone_number**, **designation** (empty strings if never set).',
  })
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
  async getVendorContacts(@CurrentUser() user: { userId: string }) {
    const data = await this.manufacturersService.getVendorContactsByAuthUserId(
      user.userId,
    );
    return { message: 'Vendor contacts retrieved successfully', data };
  }

  @Patch('contacts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update technical and marketing contacts',
    description:
      'JSON body with **technicalContact** and **marketingContact** objects. Each must include **name**, **email_id**, **phone_number**, and **designation** (all required).',
  })
  @ApiBody({ type: UpdateVendorContactsDto })
  @ApiResponse({ status: 200, description: 'Contacts updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or no linked manufacturer',
  })
  async updateVendorContacts(
    @CurrentUser()
    user: {
      userId: string;
      manufacturerId?: string;
      vendorId?: string;
    },
    @Body() dto: UpdateVendorContactsDto,
  ) {
    const data = await this.manufacturersService.updateVendorContacts(user, dto);
    return { message: 'Vendor contacts updated successfully', data };
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vendor change password',
    description: 'Changes password for the logged-in vendor user.',
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  async changeVendorPassword(
    @CurrentUser() user: { userId: string },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.manufacturersService.changePassword(
      user.userId,
      changePasswordDto,
    );
    return { message: 'Password changed successfully' };
  }
}
