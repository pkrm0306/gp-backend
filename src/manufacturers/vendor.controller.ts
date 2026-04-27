import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ManufacturersService } from './manufacturers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-manufacturer-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Vendor')
@Controller('api/vendor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get vendor details from manufacturer table (auth user based)',
    description:
      'Uses logged-in user id from JWT, resolves manufacturer mapping via vendor-users, and returns vendor details from manufacturer record.',
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
      'Updates vendor/company fields on the linked manufacturer record for the logged-in vendor user.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Vendor profile updated successfully',
  })
  async updateVendorProfile(
    @CurrentUser() user: { userId: string },
    @Body() updateDto: UpdateProfileDto,
  ) {
    const data = await this.manufacturersService.editProfile(
      user.userId,
      updateDto,
    );
    return { message: 'Vendor profile updated successfully', data };
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
