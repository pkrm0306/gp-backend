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
import { AnyPermissions } from '../common/decorators/any-permissions.decorator';
import {
  RBAC_ASSIGNABLE_PERMISSION_VALUES,
  DASHBOARD_PERMISSION_CATALOG,
  PERMISSIONS,
} from '../common/constants/permissions.constants';
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
import { isPlatformAdminUser } from '../common/utils/platform-admin.util';

type AdminPortalUser = {
  manufacturerId?: string;
  vendorId?: string;
  userId: string;
  role: string;
  type?: string;
};

/** Admin portal RBAC is platform-scoped (not tied to a manufacturer). */
const PLATFORM_RBAC_SCOPE = undefined;

/** Designation (UI) / role (API) — granular keys plus legacy manage. */
const DESIGNATION_READ_PERMISSIONS = [
  PERMISSIONS.RBAC_ROLES_MANAGE,
  PERMISSIONS.RBAC_ROLES_VIEW,
  PERMISSIONS.RBAC_ROLES_ADD,
  PERMISSIONS.RBAC_ROLES_UPDATE,
  PERMISSIONS.RBAC_ROLES_DELETE,
  PERMISSIONS.RBAC_ROLES_STATUS,
] as const;

@ApiTags('Admin RBAC')
@ApiBearerAuth()
@Controller('admin/rbac')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('permissions/catalog')
  @AnyPermissions(...DESIGNATION_READ_PERMISSIONS)
  @ApiOperation({
    summary: 'Permission catalog for role add/edit UI',
    description:
      'Returns dashboard section permissions (nested under Dashboard) plus all known permission keys for module checkboxes.',
  })
  listPermissionCatalog() {
    return {
      message: 'Permission catalog retrieved successfully',
      data: {
        dashboard: DASHBOARD_PERMISSION_CATALOG,
        allPermissions: RBAC_ASSIGNABLE_PERMISSION_VALUES,
      },
    };
  }

  @Post('roles')
  @AnyPermissions(PERMISSIONS.RBAC_ROLES_MANAGE, PERMISSIONS.RBAC_ROLES_ADD)
  async createRole(@Body() dto: CreateRoleDto) {
    const data = await this.rbacService.createRole(PLATFORM_RBAC_SCOPE, dto);
    return { message: 'Role created successfully', data };
  }

  @Get(['roles', 'roles/list'])
  @AnyPermissions(...DESIGNATION_READ_PERMISSIONS)
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
  async listRoles(@Query() query: ListRolesQueryDto) {
    const result = await this.rbacService.listRoles(PLATFORM_RBAC_SCOPE, query);
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
  @AnyPermissions(PERMISSIONS.RBAC_ROLES_MANAGE, PERMISSIONS.RBAC_ROLES_UPDATE)
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const data = await this.rbacService.updateRole(PLATFORM_RBAC_SCOPE, id, dto);
    return { message: 'Role updated successfully', data };
  }

  @Patch('roles/:id/status')
  @AnyPermissions(PERMISSIONS.RBAC_ROLES_MANAGE, PERMISSIONS.RBAC_ROLES_STATUS)
  async updateRoleStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRoleStatusDto,
  ) {
    const desired =
      dto?.status !== undefined ? String(dto.status).trim().toLowerCase() : undefined;
    let status: number | undefined = undefined;
    if (desired === 'active' || desired === '1') status = 1;
    if (desired === 'inactive' || desired === '0') status = 0;
    const data = await this.rbacService.setOrToggleRoleStatus(
      PLATFORM_RBAC_SCOPE,
      id,
      status,
    );
    return { message: 'Role status updated successfully', data };
  }

  @Delete('roles/:id/delete')
  @AnyPermissions(PERMISSIONS.RBAC_ROLES_MANAGE, PERMISSIONS.RBAC_ROLES_DELETE)
  async deleteRole(@Param('id') id: string) {
    const data = await this.rbacService.deleteRole(PLATFORM_RBAC_SCOPE, id);
    return { message: 'Role deleted successfully', data };
  }

  @Post('staff')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  async createStaff(@Body() dto: CreateStaffDto) {
    const data = await this.rbacService.createStaff(PLATFORM_RBAC_SCOPE, dto);
    return { message: 'Staff user created successfully', data };
  }

  @Get('staff')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  async listStaff() {
    const data = await this.rbacService.listStaff(PLATFORM_RBAC_SCOPE);
    return { message: 'Staff users retrieved successfully', data };
  }

  @Post('staff/roles')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  async assignRole(@Body() dto: AssignRoleDto) {
    const data = await this.rbacService.assignRole(PLATFORM_RBAC_SCOPE, dto);
    return { message: 'Role assigned successfully', data };
  }

  @Patch('staff/roles')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  async updateRoleAssignment(@Body() dto: AssignRoleDto) {
    const normalizedRoleIds =
      Array.isArray(dto.roleIds) && dto.roleIds.length > 0
        ? dto.roleIds
        : dto.roleId
          ? [dto.roleId]
          : [];
    const data = await this.rbacService.replaceStaffRoles(PLATFORM_RBAC_SCOPE, {
      vendorUserId: dto.vendorUserId,
      roleIds: normalizedRoleIds,
    });
    return { message: 'Staff role updated successfully', data };
  }

  @Delete('staff/roles')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  async unassignRole(@Body() dto: UnassignStaffRoleDto) {
    const data = await this.rbacService.unassignStaffRole(
      PLATFORM_RBAC_SCOPE,
      dto.vendorUserId,
    );
    return { message: 'Staff role unassigned successfully', data };
  }

  @Get('staff/permission-context')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  @AllowStaffSelfRoleRead()
  async getStaffPermissionContext(
    @CurrentUser() user: AdminPortalUser,
    @Query('vendorUserId') vendorUserId?: string,
  ) {
    if (isPlatformAdminUser(user)) {
      const data = await this.rbacService.getStaffPermissionContext(
        PLATFORM_RBAC_SCOPE,
        user.userId,
      );
      return { message: 'Permission context retrieved successfully', data };
    }

    if (user.role === 'staff') {
      if (vendorUserId && vendorUserId !== user.userId) {
        throw new ForbiddenException(
          'Staff can access only their own permission context',
        );
      }
      const data = await this.rbacService.getStaffPermissionContext(
        PLATFORM_RBAC_SCOPE,
        user.userId,
      );
      return { message: 'Permission context retrieved successfully', data };
    }

    const targetId = String(vendorUserId ?? '').trim();
    if (!targetId) {
      throw new BadRequestException(
        'vendorUserId query parameter is required when viewing another staff member',
      );
    }
    const data = await this.rbacService.getStaffPermissionContext(
      PLATFORM_RBAC_SCOPE,
      targetId,
    );
    return { message: 'Permission context retrieved successfully', data };
  }

  @Get('staff/roles')
  @Permissions(PERMISSIONS.RBAC_STAFF_MANAGE)
  @AllowStaffSelfRoleRead()
  async getStaffWithRoles(
    @CurrentUser() user: AdminPortalUser,
    @Query('vendorUserId') vendorUserId?: string,
  ) {
    if (user.role === 'staff') {
      if (vendorUserId && vendorUserId !== user.userId) {
        throw new ForbiddenException('Staff can access only own role mapping');
      }
      const data = await this.rbacService.getStaffWithRoles(
        PLATFORM_RBAC_SCOPE,
        user.userId,
      );
      return { message: 'Staff roles retrieved successfully', data };
    }

    const data = await this.rbacService.getStaffWithRoles(
      PLATFORM_RBAC_SCOPE,
      vendorUserId,
    );
    return { message: 'Staff roles retrieved successfully', data };
  }
}
