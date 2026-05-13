import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { certificationMultipartMemoryMulterOptions } from '../common/upload/multer-universal.config';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RawMaterialsEliminationOfFormaldehydeService } from './raw-materials-elimination-of-formaldehyde.service';
import { CreateRawMaterialsEliminationOfFormaldehydeDto } from './dto/create-raw-materials-elimination-of-formaldehyde.dto';

@ApiTags('Raw Materials Elimination Of Formaldehyde')
@Controller('raw-materials-elimination-of-formaldehyde')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsEliminationOfFormaldehydeController {
  constructor(
    private readonly service: RawMaterialsEliminationOfFormaldehydeService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create raw materials elimination of formaldehyde record (per URN)',
  })
  @UseInterceptors(
    FileInterceptor('formaldehydeFile', certificationMultipartMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo', 'productsName', 'productsTestReport'],
      properties: {
        urnNo: { type: 'string', example: 'URN-20260305124230' },
        productsName: { type: 'string', example: 'Low-VOC board material' },
        productsTestReport: {
          type: 'string',
          example: 'Formaldehyde elimination test report details/reference',
        },
        formaldehydeFileName: { type: 'string', example: 'Formaldehyde Test Report - 2026' },
        formaldehydeFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFile() formaldehydeFile?: Express.Multer.File,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const dto: CreateRawMaterialsEliminationOfFormaldehydeDto = {
      urnNo: body.urnNo,
      productsName: body.productsName,
      productsTestReport: body.productsTestReport,
      formaldehydeFileName: body.formaldehydeFileName,
    };
    const data = await this.service.create(dto, user.vendorId, formaldehydeFile);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'List raw materials elimination of formaldehyde records by URN',
  })
  @ApiParam({ name: 'urn_no', example: 'URN-20260305124230' })
  @ApiResponse({ status: 200, description: 'Retrieved successfully' })
  async listByUrn(@CurrentUser() user: any, @Param('urn_no') urnNo: string) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    if (!urnNo || urnNo.trim() === '') {
      throw new BadRequestException('URN number is required');
    }
    const data = await this.service.listByUrn(urnNo.trim(), user.vendorId);
    return { success: true, data };
  }
}
