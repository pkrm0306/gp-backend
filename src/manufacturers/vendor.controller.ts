import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
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
        { name: 'companyLogo', maxCount: 1 },
        { name: 'pan', maxCount: 1 },
      ],
      vendorProfileBrandingMemoryMulterOptions(),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload GST certificate (PDF) and/or company logo (image)',
    description:
      'Multipart: **gst** = one PDF (GST certificate); **companyLogo** = one image (jpeg/png/gif/webp); **pan** = one PDF or JPEG (PAN card). ' +
      'At least one file is required. Files are stored via the shared **uploadFile** helper (local `uploads/manufacturers/` or S3 when configured).',
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
      companyLogo?: Express.Multer.File[];
      pan?: Express.Multer.File[];
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
      'Includes **gstPdf**, **companyLogo**, and **pan** (PAN document URL) when set.',
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
  @ApiOperation({
    summary: 'Update vendor profile (auth user based)',
    description:
      'Updates vendor/company fields on the linked **manufacturer** for the logged-in vendor user. ' +
      '**gst**: GST certificate **PDF** as a URL path (e.g. `/uploads/manufacturers/vendor-gst-….pdf`) or `https://…`; plain GSTIN without a URL shape should go in **gstNumber** (or legacy: send GSTIN in **gst**). ' +
      '**companyLogo**: company logo **image** URL path. **pan**: PAN card document URL path (**PDF** or **JPEG** only). ' +
      'Alternatively use **POST /api/vendor/profile/upload** with multipart files **gst** (PDF), **companyLogo** (image), and/or **pan** (PDF/JPEG); uploads use the shared **uploadFile** pipeline (S3 or local).',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Vendor profile updated successfully',
  })
  async updateVendorProfile(
    @CurrentUser() user: {
      userId: string;
      manufacturerId?: string;
      vendorId?: string;
    },
    @Body() updateDto: UpdateProfileDto,
  ) {
    const data = await this.manufacturersService.editProfile(
      user,
      updateDto,
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
