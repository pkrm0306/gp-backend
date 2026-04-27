import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DocumentsService } from './documents.service';
import { DeleteDocumentParamsDto } from './dto/delete-document-params.dto';
import { DeleteDocumentQueryDto } from './dto/delete-document-query.dto';

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Delete(':documentId')
  @ApiOperation({
    summary: 'Soft-delete a section document',
    description:
      'Soft-deletes a document only when the authenticated vendor owns the document and it matches the provided URN and section key.',
  })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Document deleted successfully' },
        data: {
          type: 'object',
          properties: {
            documentId: { type: 'number', example: 1001 },
            urnNo: { type: 'string', example: 'URN-20260305124230' },
            sectionKey: { type: 'string', example: 'product_design' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad input' })
  @ApiResponse({ status: 403, description: 'Unauthorized ownership' })
  @ApiResponse({ status: 404, description: 'Document not found for URN/section' })
  async deleteDocument(
    @CurrentUser() user: any,
    @Param() params: DeleteDocumentParamsDto,
    @Query() query: DeleteDocumentQueryDto,
  ) {
    if (!user?.vendorId) {
      throw new BadRequestException('Vendor ID not found in token');
    }

    const data = await this.documentsService.softDeleteDocument(
      params.documentId,
      user.vendorId,
      query,
    );

    return {
      success: true,
      message: 'Document deleted successfully',
      data,
    };
  }
}
