import {
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../common/constants/permissions.constants';
import { AllowStaffSelfRoleRead } from '../common/decorators/allow-staff-self-role-read.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
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

  @Get('roles')
  @Permissions(PERMISSIONS.RBAC_ROLES_MANAGE)
  async listRoles(@CurrentUser() user: { manufacturerId: string }) {
    const data = await this.rbacService.listRoles(user.manufacturerId);
    return { message: 'Roles retrieved successfully', data };
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

  @Delete('roles/:id')
  @Permissions(PERMISSIONS.RBAC_ROLES_MANAGE)
  async disableRole(
    @CurrentUser() user: { manufacturerId: string },
    @Param('id') id: string,
  ) {
    const data = await this.rbacService.disableRole(user.manufacturerId, id);
    return { message: 'Role disabled successfully', data };
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
    const data = await this.rbacService.updateStaffRole(user.manufacturerId, dto);
    return { message: 'Staff role updated successfully', data };
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

