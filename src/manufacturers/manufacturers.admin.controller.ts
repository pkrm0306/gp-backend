import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { ManufacturersService } from './manufacturers.service';
import { DeleteUnverifiedManufacturerDto } from './dto/delete-unverified-manufacturer.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';

@ApiTags('Admin Manufacturers')
@Controller('api/admin/manufacturers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminManufacturerActionsController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post('delete_unverified_manufacturer_by_id')
  @Permissions(PERMISSIONS.MANUFACTURERS_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete unverified manufacturer by id',
    description:
      'Deletes manufacturer only when manufacturerStatus is unverified (0 or 2).',
  })
  @ApiBody({ type: DeleteUnverifiedManufacturerDto })
  @ApiResponse({ status: 200, description: 'Unverified manufacturer deleted' })
  async deleteUnverified(@Body() dto: DeleteUnverifiedManufacturerDto) {
    const data = await this.manufacturersService.deleteUnverifiedById(
      dto.manufacturer_id,
    );
    return { message: 'Unverified manufacturer deleted successfully', data };
  }
}
