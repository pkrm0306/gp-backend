import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from '../admin/admin.service';
import { CategoriesService } from '../categories/categories.service';
import { ListTeamMembersQueryDto } from '../admin/dto/list-team-members-query.dto';

@ApiTags('Team members')
@Controller('api/team-members')
export class TeamMembersController {
  constructor(
    private readonly adminService: AdminService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get('by-category/:categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List team members for a category (paginated)',
    description:
      'Same filters and pagination as **GET /admin/team-members/list** (`status`, `designation`, `page`, `limit`), except the category is fixed by the path — do not rely on a separate category query param. ' +
      '**categoryId** may be the numeric `category_id` from GET /categories or the category MongoDB `_id` (24-char hex). Returns 400 if the category does not exist. Matches members where **category_ids** contains the id or legacy **category_id** equals it.',
  })
  @ApiParam({
    name: 'categoryId',
    description:
      'Numeric `category_id` from GET /categories, or category document `_id` (MongoDB ObjectId string)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'active | inactive',
  })
  @ApiQuery({
    name: 'designation',
    required: false,
    description: 'Exact designation match (case-insensitive)',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Default 1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Default 10' })
  @ApiResponse({ status: 200, description: 'Paginated list' })
  @ApiResponse({ status: 400, description: 'Invalid or unknown category id' })
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query() query: ListTeamMembersQueryDto,
  ) {
    const cid = await this.categoriesService.resolveNumericCategoryKey(categoryId);
    const result = await this.adminService.listTeamMembersPaginated('', query, {
      categoryNumericId: cid,
    });
    return {
      message: 'Team members retrieved successfully',
      data: result.data,
      displayOrderMax: result.displayOrderMax,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  }
}
