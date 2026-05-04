import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import {
  StaffRoleMapping,
  StaffRoleMappingDocument,
} from './schemas/staff-role-mapping.schema';
import {
  VendorUser,
  VendorUserDocument,
} from '../vendor-users/schemas/vendor-user.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { VendorUsersService } from '../vendor-users/vendor-users.service';
import {
  expandEffectivePermissions,
  minimizePermissionSet,
} from '../common/permissions/permission-hierarchy';
import { ALL_KNOWN_PERMISSION_VALUES } from '../common/constants/permissions.constants';
import { EmailService } from '../common/services/email.service';

@Injectable()
export class RbacService {
  private readonly logger = new Logger(RbacService.name);

  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(StaffRoleMapping.name)
    private mappingModel: Model<StaffRoleMappingDocument>,
    @InjectModel(VendorUser.name)
    private vendorUserModel: Model<VendorUserDocument>,
    private vendorUsersService: VendorUsersService,
    private emailService: EmailService,
  ) {}

  private toObjectId(id: string, field: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${field}`);
    }
    return new Types.ObjectId(id);
  }

  private canonicalizePermission(permission: string): string {
    const raw = String(permission || '').trim().toLowerCase();
    if (!raw) return raw;

    // Canonical namespace: inquiries:*
    if (raw === 'inquiries.view' || raw === 'contacts.view' || raw === 'contact.view') {
      return 'inquiries:view';
    }
    if (
      raw === 'inquiries.reply' ||
      raw === 'contacts.reply' ||
      raw === 'contact.reply' ||
      raw === 'inquiries.update'
    ) {
      return 'inquiries:reply';
    }
    if (
      raw === 'inquiries.delete' ||
      raw === 'contacts.delete' ||
      raw === 'contact.delete'
    ) {
      return 'inquiries:delete';
    }

    // Generic normalization for old dot-style keys.
    return raw.replace(/\./g, ':');
  }

  /**
   * Canonical permission strings for storage. Redundant child grants are dropped when
   * a parent grant already implies them (minimal storage; see docs/permission-hierarchy.md).
   */
  private normalizePermissions(permissions: string[]): string[] {
    const normalized = Array.from(
      new Set(
        (permissions || [])
          .map((permission) => this.canonicalizePermission(permission))
          .filter(Boolean),
      ),
    );
    return minimizePermissionSet(normalized);
  }

  /** Effective permissions for UI: known keys implied by stored role grants. */
  effectivePermissionsFromRaw(rawPermissions: string[]): string[] {
    return expandEffectivePermissions(rawPermissions, ALL_KNOWN_PERMISSION_VALUES);
  }

  async createRole(manufacturerId: string, dto: CreateRoleDto) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    try {
      return await this.roleModel.create({
        manufacturerId: manufacturerObjectId,
        name: dto.name.trim(),
        description: dto.description?.trim() || '',
        permissions: this.normalizePermissions(dto.permissions || []),
        status: dto.status ?? 1,
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException('Role name already exists');
      }
      throw error;
    }
  }

  async listRoles(manufacturerId: string) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    return this.roleModel
      .find({ manufacturerId: manufacturerObjectId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async updateRole(manufacturerId: string, roleId: string, dto: UpdateRoleDto) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const roleObjectId = this.toObjectId(roleId, 'roleId');
    const updateDoc: Record<string, unknown> = {};
    if (dto.name !== undefined) updateDoc.name = dto.name.trim();
    if (dto.description !== undefined) updateDoc.description = dto.description.trim();
    if (dto.permissions !== undefined) {
      updateDoc.permissions = this.normalizePermissions(dto.permissions);
    }
    if (dto.status !== undefined) updateDoc.status = dto.status;

    const row = await this.roleModel
      .findOneAndUpdate(
        { _id: roleObjectId, manufacturerId: manufacturerObjectId },
        { $set: updateDoc },
        { new: true },
      )
      .exec();
    if (!row) throw new NotFoundException('Role not found');
    return row;
  }

  async disableRole(manufacturerId: string, roleId: string) {
    return this.updateRole(manufacturerId, roleId, { status: 0 });
  }

  async createStaff(manufacturerId: string, dto: CreateStaffDto) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const existing = await this.vendorUsersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already exists');

    const createdStaff = await this.vendorUsersService.create({
      manufacturerId: manufacturerObjectId,
      vendorId: manufacturerObjectId,
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone.trim(),
      password: dto.password,
      type: 'staff',
      status: 1,
      isVerified: true,
    });

    try {
      await this.emailService.sendStaffCredentialsEmail(
        dto.email.trim().toLowerCase(),
        dto.password,
        dto.name.trim(),
      );
    } catch (error) {
      this.logger.warn(
        `Staff created but credentials email failed for ${dto.email.trim().toLowerCase()}: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    return createdStaff;
  }

  async listStaff(manufacturerId: string) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    return this.vendorUserModel
      .find({
        manufacturerId: manufacturerObjectId,
        type: 'staff',
        status: { $ne: 2 },
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async assignRole(manufacturerId: string, dto: AssignRoleDto) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
    const roleId = this.toObjectId(dto.roleId, 'roleId');

    const [user, role] = await Promise.all([
      this.vendorUserModel
        .findOne({ _id: vendorUserId, manufacturerId: manufacturerObjectId })
        .exec(),
      this.roleModel
        .findOne({ _id: roleId, manufacturerId: manufacturerObjectId, status: 1 })
        .exec(),
    ]);
    if (!user) throw new NotFoundException('Staff user not found');
    if (user.type !== 'staff') {
      throw new BadRequestException('Role assignment only allowed for staff');
    }
    if (!role) throw new NotFoundException('Role not found');

    return this.mappingModel
      .findOneAndUpdate(
        { manufacturerId: manufacturerObjectId, vendorUserId, roleId },
        { $set: { status: 1 } },
        { upsert: true, new: true },
      )
      .exec();
  }

  async updateStaffRole(manufacturerId: string, dto: AssignRoleDto) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
    const roleId = this.toObjectId(dto.roleId, 'roleId');

    const role = await this.roleModel
      .findOne({ _id: roleId, manufacturerId: manufacturerObjectId, status: 1 })
      .exec();
    if (!role) throw new NotFoundException('Role not found');

    const user = await this.vendorUserModel
      .findOne({ _id: vendorUserId, manufacturerId: manufacturerObjectId })
      .exec();
    if (!user) throw new NotFoundException('Staff user not found');
    if (user.type !== 'staff') {
      throw new BadRequestException('Role assignment only allowed for staff');
    }

    await this.mappingModel.deleteMany({
      manufacturerId: manufacturerObjectId,
      vendorUserId,
    });
    return this.mappingModel.create({
      manufacturerId: manufacturerObjectId,
      vendorUserId,
      roleId,
      status: 1,
    });
  }

  async getStaffWithRoles(manufacturerId: string, vendorUserId?: string) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const where: Record<string, unknown> = {
      manufacturerId: manufacturerObjectId,
      status: 1,
    };
    if (vendorUserId) {
      where.vendorUserId = this.toObjectId(vendorUserId, 'vendorUserId');
    }
    const rows = await this.mappingModel
      .find(where)
      .populate('vendorUserId')
      .populate('roleId')
      .lean()
      .exec();

    return rows.map((row: Record<string, unknown>) => {
      const role = row.roleId as
        | { permissions?: string[]; status?: number; [k: string]: unknown }
        | null
        | undefined;
      const roleActive = role && role.status !== 0;
      const raw = roleActive
        ? this.normalizePermissions(role!.permissions || [])
        : [];
      const effective = roleActive ? this.effectivePermissionsFromRaw(raw) : [];
      const roleIdPayload =
        role && typeof role === 'object'
          ? { ...role, effectivePermissions: effective }
          : role;
      return {
        ...row,
        effectivePermissions: effective,
        roleId: roleIdPayload,
      };
    });
  }

  async getStaffPermissions(
    manufacturerId: string,
    vendorUserId: string,
  ): Promise<string[]> {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');
    const mappings = await this.mappingModel
      .find({
        manufacturerId: manufacturerObjectId,
        vendorUserId: vendorUserObjectId,
        status: 1,
      })
      .populate('roleId')
      .lean()
      .exec();

    const permissions = new Set<string>();
    for (const mapping of mappings) {
      const role = mapping.roleId as unknown as { permissions?: string[]; status?: number };
      if (role?.status === 0) continue;
      for (const permission of this.normalizePermissions(role?.permissions || [])) {
        permissions.add(permission);
      }
    }
    return minimizePermissionSet(Array.from(permissions));
  }
}

