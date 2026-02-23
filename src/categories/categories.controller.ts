import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Returns all categories from the categories collection, sorted by category name ascending',
  })
  @ApiResponse({ status: 200, description: 'List of categories retrieved successfully' })
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      message: 'Categories retrieved successfully',
      data: categories,
    };
  }
}
