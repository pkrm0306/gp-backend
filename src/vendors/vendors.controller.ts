import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-vendor.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Vendor')
@Controller('vendor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get vendor profile' })
  async getProfile(@CurrentUser() user: any) {
    const profile = await this.vendorsService.getProfile(user.vendorId);
    return { message: 'Profile retrieved successfully', data: profile };
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Update vendor profile',
    description:
      'Updates both manufacturer and vendor collections using MongoDB transaction. Updates manufacturerName from companyName, and vendor fields (vendorName, vendorDesignation, vendorGst, vendorEmail, vendorPhone) from respective input fields.',
  })
  @ApiBody({ type: UpdateProfileDto })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.vendorsService.updateProfile(
      user.userId,
      updateProfileDto,
    );
    return { message: 'Profile updated successfully', data: profile };
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @CurrentUser() user: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.vendorsService.changePassword(user.userId, changePasswordDto);
    return { message: 'Password changed successfully' };
  }
}
