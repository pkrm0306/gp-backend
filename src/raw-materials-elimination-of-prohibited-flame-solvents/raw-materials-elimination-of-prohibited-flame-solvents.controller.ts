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
import { RawMaterialsEliminationOfProhibitedFlameSolventsService } from './raw-materials-elimination-of-prohibited-flame-solvents.service';
import { CreateRawMaterialsEliminationOfProhibitedFlameSolventsDto } from './dto/create-raw-materials-elimination-of-prohibited-flame-solvents.dto';
import {
  assertAtLeastOneRawMaterialsField,
  assertRawMaterialsDocumentTypes,
  parseRequiredRawMaterialsUrn,
} from '../common/raw-materials/raw-materials-upload.util';

@ApiTags('Raw Materials Elimination Of Prohibited Flame Solvents')
@Controller('raw-materials-elimination-of-prohibited-flame-solvents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RawMaterialsEliminationOfProhibitedFlameSolventsController {
  constructor(
    private readonly service: RawMaterialsEliminationOfProhibitedFlameSolventsService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Create raw materials elimination of prohibited flame solvents record (per URN)',
  })
  @UseInterceptors(
    FileInterceptor('prohibitedFlameSolventsFile', certificationMultipartMemoryMulterOptions()),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['urnNo'],
      properties: {
        urnNo: { type: 'string', example: 'URN-20260305124230' },
        details: {
          type: 'string',
          example: 'Eliminated prohibited flame solvents and replaced with compliant alternatives.',
        },
        prohibitedFlameSolventsFileName: {
          type: 'string',
          example: 'Prohibited Flame Solvents Supporting Document - 2026',
        },
        prohibitedFlameSolventsFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
    @UploadedFile() prohibitedFlameSolventsFile?: Express.Multer.File,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }
    const dto: CreateRawMaterialsEliminationOfProhibitedFlameSolventsDto = {
      urnNo: parseRequiredRawMaterialsUrn(body),
      details: body.details,
      prohibitedFlameSolventsFileName: body.prohibitedFlameSolventsFileName,
    };
    if (prohibitedFlameSolventsFile) {
      assertRawMaterialsDocumentTypes([prohibitedFlameSolventsFile]);
    }
    assertAtLeastOneRawMaterialsField({
      files: prohibitedFlameSolventsFile ? [prohibitedFlameSolventsFile] : [],
      textValues: [dto.details],
    });
    const data = await this.service.create(dto, user.vendorId, prohibitedFlameSolventsFile);
    return { success: true, data };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary:
      'List raw materials elimination of prohibited flame solvents records by URN',
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
