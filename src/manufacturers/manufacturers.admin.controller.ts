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
import { ManufacturersService } from './manufacturers.service';
import { DeleteUnverifiedManufacturerDto } from './dto/delete-unverified-manufacturer.dto';

@ApiTags('Admin Manufacturers')
@Controller('api/admin/manufacturers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminManufacturerActionsController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post('delete_unverified_manufacturer_by_id')
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
