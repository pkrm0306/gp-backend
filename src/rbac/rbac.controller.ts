import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { AllowStaffSelfRoleRead } from '../common/decorators/allow-staff-self-role-read.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRoleStatusDto } from './dto/update-role-status.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UnassignStaffRoleDto } from './dto/unassign-staff-role.dto';
import { ListRolesQueryDto } from './dto/list-roles-query.dto';
import { RbacService } from './rbac.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';

@ApiTags('Admin RBAC')
@ApiBearerAuth()
@Controller('admin/rbac')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Post('roles')
  @Permissions(PERMISSIONS.RBAC_ROLES_MANAGE)
  async createRole(
    @CurrentUser() user: { manufacturerId: string },
    @Body() dto: CreateRoleDto,
  ) {
    const data = await this.rbacService.createRole(user.manufacturerId, dto);
    return { message: 'Role created successfully', data };
  }

  @Get(['roles', 'roles/list'])
  @Permissions(PERMISSIONS.RBAC_ROLES_MANAGE)
  @ApiOperation({
    summary: 'List roles',
    description:
      'Omit **page** and **limit** to return every role (backward compatible envelope with **message** + **data** + **total**). ' +
      'Send **page** and/or **limit** for server-side pagination (**success**, **data**, **total**, **page**, **limit**). ' +
      'Optional **search** matches name, description, or permission strings (case-insensitive). ' +
      'Optional **sort** = `name` | `id` | `createdAt` and **order** = `asc` | `desc` (stable tie-break on `_id`).',
  })
  @ApiQuery({ name: 'page', required: false, description: '1-based page (enables paging when set with limit or alone)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Page size, max 100 (default 10 when paging)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false, enum: ['name', 'id', 'createdAt'] })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Unpaged: { message, data, total }. Paged: { success, data, total, page, limit }.',
  })
  async listRoles(
    @CurrentUser() user: { manufacturerId: string },
    @Query() query: ListRolesQueryDto,
  ) {
    const result = await this.rbacService.listRoles(user.manufacturerId, query);
    if (result.paged) {
      return {
        message: 'Roles retrieved successfully',
        success: true,
        data: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    }
    return {
      message: 'Roles retrieved successfully',
      data: result.data,
      total: result.total,
    };
  }

  @Patch('roles/:id')
  @Permissions(PERMISSIONS.RBAC_ROLES_MANAGE)
  async updateRole(
    @CurrentUser() user: { manufacturerId: string },
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    const data = await this.rbacService.updateRole(user.manufacturerId, id, dto);
    return { message: 'Role updated successfully', data };
  }

  @Patch('roles/:id/status')
  @Permissions(PERMISSIONS.RBAC_ROLES_MANAGE)
  async updateRoleStatus(
    @CurrentUser() user: { manufacturerId: string },
    @Param('id') id: string,
    @Body() dto: UpdateRoleStatusDto,
  ) {
    const desired =
      dto?.status !== undefined ? String(dto.status).trim().toLowerCase() : undefined;
    let status: number | undefined = undefined;
    if (desired === 'active' || desired === '1') status = 1;
    if (desired === 'inactive' || desired === '0') status = 0;
    const data = await this.rbacService.setOrToggleRoleStatus(
      user.manufacturerId,
      id,
      status,
    );
    return { message: 'Role status updated successfully', data };
  }

  @Delete('roles/:id/delete')
  @Permissions(PERMISSIONS.RBAC_ROLES_MANAGE)
  async deleteRole(
    @CurrentUser() user: { manufacturerId: string },
    @Param('id') id: string,
  ) {
    const data = await this.rbacService.deleteRole(user.manufacturerId, id);
    return { message: 'Role deleted successfully', data };
  }

  @Post('staff')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  async createStaff(
    @CurrentUser() user: { manufacturerId: string },
    @Body() dto: CreateStaffDto,
  ) {
    const data = await this.rbacService.createStaff(user.manufacturerId, dto);
    return { message: 'Staff user created successfully', data };
  }

  @Get('staff')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  async listStaff(@CurrentUser() user: { manufacturerId: string }) {
    const data = await this.rbacService.listStaff(user.manufacturerId);
    return { message: 'Staff users retrieved successfully', data };
  }

  @Post('staff/roles')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  async assignRole(
    @CurrentUser() user: { manufacturerId: string },
    @Body() dto: AssignRoleDto,
  ) {
    const data = await this.rbacService.assignRole(user.manufacturerId, dto);
    return { message: 'Role assigned successfully', data };
  }

  @Patch('staff/roles')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  async updateRoleAssignment(
    @CurrentUser() user: { manufacturerId: string },
    @Body() dto: AssignRoleDto,
  ) {
    const normalizedRoleIds =
      Array.isArray(dto.roleIds) && dto.roleIds.length > 0
        ? dto.roleIds
        : dto.roleId
          ? [dto.roleId]
          : [];
    const data = await this.rbacService.replaceStaffRoles(user.manufacturerId, {
      vendorUserId: dto.vendorUserId,
      roleIds: normalizedRoleIds,
    });
    return { message: 'Staff role updated successfully', data };
  }

  @Delete('staff/roles')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  async unassignRole(
    @CurrentUser() user: { manufacturerId: string },
    @Body() dto: UnassignStaffRoleDto,
  ) {
    const data = await this.rbacService.unassignStaffRole(
      user.manufacturerId,
      dto.vendorUserId,
    );
    return { message: 'Staff role unassigned successfully', data };
  }

  @Get('staff/permission-context')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  @AllowStaffSelfRoleRead()
  async getStaffPermissionContext(
    @CurrentUser() user: { manufacturerId: string; userId: string; role: string },
    @Query('vendorUserId') vendorUserId?: string,
  ) {
    if (user.role === 'staff') {
      if (vendorUserId && vendorUserId !== user.userId) {
        throw new ForbiddenException(
          'Staff can access only their own permission context',
        );
      }
      const data = await this.rbacService.getStaffPermissionContext(
        user.manufacturerId,
        user.userId,
      );
      return { message: 'Permission context retrieved successfully', data };
    }

    const targetId = String(vendorUserId ?? '').trim();
    if (!targetId) {
      throw new BadRequestException(
        'vendorUserId query parameter is required for manufacturer admins',
      );
    }
    const data = await this.rbacService.getStaffPermissionContext(
      user.manufacturerId,
      targetId,
    );
    return { message: 'Permission context retrieved successfully', data };
  }

  @Get('staff/roles')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  @AllowStaffSelfRoleRead()
  async getStaffWithRoles(
    @CurrentUser() user: { manufacturerId: string; userId: string; role: string },
    @Query('vendorUserId') vendorUserId?: string,
  ) {
    if (user.role === 'staff') {
      if (vendorUserId && vendorUserId !== user.userId) {
        throw new ForbiddenException('Staff can access only own role mapping');
      }
      const data = await this.rbacService.getStaffWithRoles(
        user.manufacturerId,
        user.userId,
      );
      return { message: 'Staff roles retrieved successfully', data };
    }

    const data = await this.rbacService.getStaffWithRoles(
      user.manufacturerId,
      vendorUserId,
    );
    return { message: 'Staff roles retrieved successfully', data };
  }
}

