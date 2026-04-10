import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryMultipartDto } from './dto/create-category-multipart.dto';
import { ListCategoriesQueryDto } from './dto/list-categories-query.dto';
import { UpdateCategoryStatusDto } from './dto/update-category-status.dto';
import { UpdateCategoryMultipartDto } from './dto/update-category-multipart.dto';
import { categoryImageMulterOptions } from './category-image-upload.config';

@ApiTags('Categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('categories')
  @ApiOperation({
    summary: 'Get all categories',
    description:
      'Returns categories from the categories collection. Optional filters: sector (single), sectors (multi-select comma-separated, listing only), status (category_status). Sort by category_name: sort=asc (A–Z, default) or sort=desc (Z–A).',
  })
  @ApiResponse({ status: 200, description: 'List of categories retrieved successfully' })
  async findAll(@Query() query: ListCategoriesQueryDto) {
    const categories = await this.categoriesService.findAll(query);
    return {
      message: 'Categories retrieved successfully',
      data: categories,
    };
  }

  @Get('categories/export')
  @ApiOperation({
    summary: 'Export categories as CSV',
    description:
      'Applies same filters as categories list: sector, status, sort (by category_name).',
  })
  @ApiResponse({ status: 200, description: 'CSV download' })
  async exportCsv(@Query() query: ListCategoriesQueryDto) {
    const csv = await this.categoriesService.buildCsvExport(query);
    const buf = Buffer.from(csv, 'utf-8');
    return new StreamableFile(buf, {
      type: 'text/csv; charset=utf-8',
      disposition: 'attachment; filename="categories-export.csv"',
    });
  }

  @Patch('categories/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update category status',
    description: 'Sets category_status (e.g. active/inactive).',
  })
  @ApiParam({ name: 'id', description: 'Category MongoDB _id' })
  @ApiBody({ type: UpdateCategoryStatusDto })
  @ApiResponse({ status: 200, description: 'Status updated' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateCategoryStatusDto) {
    const data = await this.categoriesService.updateStatus(id, dto);
    return {
      message: 'Category status updated successfully',
      data,
    };
  }

  @Patch('categories/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', categoryImageMulterOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Edit category (PATCH)',
    description:
      'Multipart: optional text fields (category_name, category_raw_material_forms, category_status, sector) and optional file field **image**. Send at least one field or a new image. Same behavior as PUT.',
  })
  @ApiParam({ name: 'id', description: 'Category MongoDB _id' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category_name: { type: 'string' },
        category_raw_material_forms: { type: 'string' },
        category_status: { type: 'integer' },
        sector: { type: 'integer' },
        image: { type: 'string', format: 'binary', description: 'New category image (optional)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 400, description: 'Nothing to update' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({
    status: 409,
    description: 'Another category already uses this name (case-insensitive)',
  })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryMultipartDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.updateCategoryMultipart(id, dto, image);
  }

  @Put('categories/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', categoryImageMulterOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Edit category (PUT)',
    description: 'Same as PATCH — multipart category update.',
  })
  @ApiParam({ name: 'id', description: 'Category MongoDB _id' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        category_name: { type: 'string' },
        category_raw_material_forms: { type: 'string' },
        category_status: { type: 'integer' },
        sector: { type: 'integer' },
        image: { type: 'string', format: 'binary', description: 'New category image (optional)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 400, description: 'Nothing to update' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({
    status: 409,
    description: 'Another category already uses this name (case-insensitive)',
  })
  async updateCategoryPut(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryMultipartDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.updateCategoryMultipart(id, dto, image);
  }

  private async updateCategoryMultipart(
    id: string,
    dto: UpdateCategoryMultipartDto,
    image?: Express.Multer.File,
  ) {
    const data = await this.categoriesService.update(id, dto, image);
    return {
      message: 'Category updated successfully',
      data,
    };
  }

  @Delete('categories/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete category',
    description:
      'Allowed only when no products reference this category (products.categoryId). Otherwise returns 409.',
  })
  @ApiParam({ name: 'id', description: 'Category MongoDB _id' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({
    status: 409,
    description: 'Products exist under this category',
  })
  async removeCategory(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return {
      message: 'Category deleted successfully',
      data: null,
    };
  }

  @Post('uploadCategoryImage')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', categoryImageMulterOptions()))
  @ApiOperation({
    summary: 'Upload category image only (optional)',
    description:
      'Saves under uploads/categories/. You can use POST /addCategory with an `image` file instead; this endpoint is for uploading an image without creating a category yet.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary', description: 'Image file' } },
    },
  })
  @ApiResponse({ status: 200, description: 'File saved' })
  @ApiResponse({ status: 400, description: 'Missing file or invalid type' })
  async uploadCategoryImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('file is required (multipart field name: file)');
    }
    const relative = `categories/${file.filename}`;
    return {
      message: 'Image uploaded successfully',
      data: {
        category_image: relative,
        category_image_url: this.categoriesService.resolveCategoryImageUrl(relative),
      },
    };
  }

  @Post('addCategory')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', categoryImageMulterOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a category (multipart — upload image here)',
    description:
      'Send multipart/form-data: text fields category_name, category_raw_material_forms, category_status, sector, and file field **image** for the picture. The server saves the file under uploads/categories/ and stores the path; you do not type a filename manually. Image is optional.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['category_name'],
      properties: {
        category_name: { type: 'string', example: 'Wooden Products' },
        category_raw_material_forms: { type: 'string', example: '1,3,2' },
        category_status: { type: 'integer', example: 1 },
        sector: { type: 'integer', example: 1 },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Category image file (JPEG, PNG, GIF, WebP). Optional.',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid image type' })
  @ApiResponse({
    status: 409,
    description: 'A category with this name already exists (case-insensitive)',
  })
  async addCategory(
    @Body() dto: CreateCategoryMultipartDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const category = await this.categoriesService.create({
      category_name: dto.category_name,
      category_image: image ? `categories/${image.filename}` : undefined,
      category_raw_material_forms: dto.category_raw_material_forms,
      category_status: dto.category_status,
      sector: dto.sector,
    });
    return {
      message: 'Category created successfully',
      data: category,
    };
  }
}

