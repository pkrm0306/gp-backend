import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ProcessCommentsService } from './process-comments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateProcessCommentsDto } from './dto/create-process-comments.dto';

@ApiTags('Process Comments')
@Controller('process-comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProcessCommentsController {
  constructor(private readonly processCommentsService: ProcessCommentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create or update process comments',
    description:
      'Creates or updates process comments for a specific URN and logged-in vendor. If a record exists for the given URN and vendor ID, it will be updated. Otherwise, a new record will be created. Only provided fields will be updated.',
  })
  @ApiBody({
    type: CreateProcessCommentsDto,
    description: 'Process comments data. Only urnNo is required. All other fields are optional.',
  })
  @ApiResponse({
    status: 201,
    description: 'Process comments created or updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            processCommentsId: { type: 'number' },
            urnNo: { type: 'string' },
            vendorId: { type: 'string' },
            productDesign: { type: 'string', nullable: true },
            productPerformance: { type: 'string', nullable: true },
            manfacturingProcess: { type: 'string', nullable: true },
            wasteManagement: { type: 'string', nullable: true },
            lifeCycleApproach: { type: 'string', nullable: true },
            productStewardship: { type: 'string', nullable: true },
            productInnovation: { type: 'string', nullable: true },
            rawMaterials31: { type: 'string', nullable: true },
            rawMaterials32: { type: 'string', nullable: true },
            rawMaterials33: { type: 'string', nullable: true },
            rawMaterials34: { type: 'string', nullable: true },
            rawMaterials35: { type: 'string', nullable: true },
            rawMaterials36: { type: 'string', nullable: true },
            rawMaterials37: { type: 'string', nullable: true },
            rawMaterials38: { type: 'string', nullable: true },
            rawMaterials39: { type: 'string', nullable: true },
            rawMaterials310: { type: 'string', nullable: true },
            rawMaterials311: { type: 'string', nullable: true },
            rawMaterials312: { type: 'string', nullable: true },
            rawMaterials313: { type: 'string', nullable: true },
            rawMaterials314: { type: 'string', nullable: true },
            rawMaterials315: { type: 'string', nullable: true },
            updatedDate: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async createOrUpdate(
    @CurrentUser() user: any,
    @Body() createProcessCommentsDto: CreateProcessCommentsDto,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const data = await this.processCommentsService.upsertProcessComments(
      createProcessCommentsDto,
      user.vendorId,
    );

    return {
      success: true,
      data,
    };
  }

  @Get(':urn_no')
  @ApiOperation({
    summary: 'Get process comments by URN',
    description:
      'Retrieves process comments for a specific URN and logged-in vendor. Returns null if no comments exist.',
  })
  @ApiParam({
    name: 'urn_no',
    description: 'URN number',
    example: 'URN-20260305124230',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Process comments retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          nullable: true,
          properties: {
            _id: { type: 'string' },
            processCommentsId: { type: 'number' },
            urnNo: { type: 'string' },
            vendorId: { type: 'string' },
            productDesign: { type: 'string', nullable: true },
            productPerformance: { type: 'string', nullable: true },
            manfacturingProcess: { type: 'string', nullable: true },
            wasteManagement: { type: 'string', nullable: true },
            lifeCycleApproach: { type: 'string', nullable: true },
            productStewardship: { type: 'string', nullable: true },
            productInnovation: { type: 'string', nullable: true },
            rawMaterials31: { type: 'string', nullable: true },
            rawMaterials32: { type: 'string', nullable: true },
            rawMaterials33: { type: 'string', nullable: true },
            rawMaterials34: { type: 'string', nullable: true },
            rawMaterials35: { type: 'string', nullable: true },
            rawMaterials36: { type: 'string', nullable: true },
            rawMaterials37: { type: 'string', nullable: true },
            rawMaterials38: { type: 'string', nullable: true },
            rawMaterials39: { type: 'string', nullable: true },
            rawMaterials310: { type: 'string', nullable: true },
            rawMaterials311: { type: 'string', nullable: true },
            rawMaterials312: { type: 'string', nullable: true },
            rawMaterials313: { type: 'string', nullable: true },
            rawMaterials314: { type: 'string', nullable: true },
            rawMaterials315: { type: 'string', nullable: true },
            updatedDate: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Vendor ID not found in token' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  async getByUrn(@CurrentUser() user: any, @Param('urn_no') urnNo: string) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const data = await this.processCommentsService.getByUrnAndVendor(urnNo, user.vendorId);

    return {
      success: true,
      data,
    };
  }
}
