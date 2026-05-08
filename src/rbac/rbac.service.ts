import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { RedisService } from '../common/redis/redis.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

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
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  private getRbacCacheTtlSeconds(): number {
    const ttl = parseInt(
      this.configService.get<string>('RBAC_CACHE_TTL_SECONDS') ||
        this.configService.get<string>('CACHE_TTL_SECONDS') ||
        '120',
      10,
    );
    return Number.isFinite(ttl) && ttl > 0 ? ttl : 120;
  }

  private async invalidateRbacCache(manufacturerId: string): Promise<void> {
    await this.redisService
      .deleteByPattern(this.redisService.buildKey('rbac', manufacturerId, '*'))
      .catch((error) => {
        this.logger.warn(
          `RBAC cache invalidation failed for manufacturer=${manufacturerId}: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
  }

  private toObjectId(id: string, field: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${field}`);
    }
    return new Types.ObjectId(id);
  }

  async hasAnyActiveStaffRoleMapping(
    manufacturerId: string,
    vendorUserId: string,
  ): Promise<boolean> {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');
    const count = await this.mappingModel
      .countDocuments({
        manufacturerId: manufacturerObjectId,
        vendorUserId: vendorUserObjectId,
        status: 1,
      })
      .exec();
    return count > 0;
  }

  private async sendFirstRoleAssignmentCredentialsIfNeeded(input: {
    manufacturerId: string;
    vendorUserId: Types.ObjectId;
    user: VendorUserDocument;
  }): Promise<void> {
    const email = String(input.user.email ?? '').trim().toLowerCase();
    const name = String(input.user.name ?? '').trim();
    if (!email) return;

    const password = crypto.randomBytes(8).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);
    await this.vendorUserModel
      .updateOne(
        { _id: input.vendorUserId },
        { $set: { password: passwordHash, updatedAt: new Date() } },
      )
      .exec();

    try {
      await this.emailService.sendStaffCredentialsEmail(email, password, name);
    } catch (error) {
      this.logger.warn(
        `First role assignment credentials email failed for ${email}: ${(error as Error)?.message || 'unknown error'}`,
      );
    }
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
      const role = await this.roleModel.create({
        manufacturerId: manufacturerObjectId,
        name: dto.name.trim(),
        description: dto.description?.trim() || '',
        permissions: this.normalizePermissions(dto.permissions || []),
        status: 1,
      });
      await this.invalidateRbacCache(manufacturerId);
      return role;
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException('Role name already exists');
      }
      throw error;
    }
  }

  async listRoles(manufacturerId: string) {
    const cacheKey = this.redisService.buildKey('rbac', manufacturerId, 'roles', 'list');
    try {
      const cached = await this.redisService.get<Record<string, unknown>[]>(cacheKey);
      if (Array.isArray(cached)) return cached;
    } catch (error) {
      this.logger.warn(
        `RBAC roles cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const rows = await this.roleModel
      .find({ manufacturerId: manufacturerObjectId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    this.redisService
      .set(cacheKey, rows, this.getRbacCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `RBAC roles cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return rows;
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

    const row = await this.roleModel
      .findOneAndUpdate(
        { _id: roleObjectId, manufacturerId: manufacturerObjectId },
        { $set: updateDoc },
        { new: true },
      )
      .exec();
    if (!row) throw new NotFoundException('Role not found');
    await this.invalidateRbacCache(manufacturerId);
    return row;
  }

  async disableRole(manufacturerId: string, roleId: string) {
    return this.setOrToggleRoleStatus(manufacturerId, roleId, 0);
  }

  async setOrToggleRoleStatus(
    manufacturerId: string,
    roleId: string,
    status?: number,
  ) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const roleObjectId = this.toObjectId(roleId, 'roleId');

    let nextStatus: number;
    if (status === 0 || status === 1) {
      nextStatus = status;
    } else {
      const current = await this.roleModel
        .findOne({ _id: roleObjectId, manufacturerId: manufacturerObjectId })
        .select('status')
        .lean()
        .exec();
      if (!current) throw new NotFoundException('Role not found');
      nextStatus = Number((current as any).status) === 1 ? 0 : 1;
    }

    const row = await this.roleModel
      .findOneAndUpdate(
        { _id: roleObjectId, manufacturerId: manufacturerObjectId },
        { $set: { status: nextStatus } },
        { new: true },
      )
      .lean()
      .exec();
    if (!row) throw new NotFoundException('Role not found');

    return {
      id: String((row as any)._id),
      status: Number((row as any).status) === 1 ? 'active' : 'inactive',
      is_active: Number((row as any).status) === 1,
    };
  }

  async deleteRole(manufacturerId: string, roleId: string) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const roleObjectId = this.toObjectId(roleId, 'roleId');

    const role = await this.roleModel
      .findOne({ _id: roleObjectId, manufacturerId: manufacturerObjectId })
      .select('_id name')
      .lean()
      .exec();
    if (!role) throw new NotFoundException('Role not found');

    const activeMappingsCount = await this.mappingModel
      .countDocuments({
        manufacturerId: manufacturerObjectId,
        roleId: roleObjectId,
        status: 1,
      })
      .exec();
    if (activeMappingsCount > 0) {
      throw new BadRequestException(
        'Cannot delete role while assigned to staff. Reassign/remove mappings first.',
      );
    }

    const res = await this.roleModel
      .deleteOne({ _id: roleObjectId, manufacturerId: manufacturerObjectId })
      .exec();
    if (!res || res.deletedCount === 0) {
      throw new NotFoundException('Role not found');
    }

    // Clean up any stale inactive mappings for this deleted role.
    await this.mappingModel
      .deleteMany({
        manufacturerId: manufacturerObjectId,
        roleId: roleObjectId,
      })
      .exec();

    return { id: String(roleObjectId), name: String((role as any).name ?? '') };
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

    await this.invalidateRbacCache(manufacturerId);
    return createdStaff;
  }

  async listStaff(manufacturerId: string) {
    const cacheKey = this.redisService.buildKey('rbac', manufacturerId, 'staff', 'list');
    try {
      const cached = await this.redisService.get<Record<string, unknown>[]>(cacheKey);
      if (Array.isArray(cached)) return cached;
    } catch (error) {
      this.logger.warn(
        `RBAC staff cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const rows = await this.vendorUserModel
      .find({
        manufacturerId: manufacturerObjectId,
        type: 'staff',
        status: { $ne: 2 },
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    this.redisService
      .set(cacheKey, rows, this.getRbacCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `RBAC staff cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return rows;
  }

  async assignRole(manufacturerId: string, dto: AssignRoleDto) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
    if (!dto.roleId) {
      throw new BadRequestException('roleId is required');
    }
    const roleId = this.toObjectId(dto.roleId, 'roleId');

    const [user, role, hadAnyRoleBefore] = await Promise.all([
      this.vendorUserModel
        .findOne({ _id: vendorUserId, manufacturerId: manufacturerObjectId })
        .exec(),
      this.roleModel
        .findOne({ _id: roleId, manufacturerId: manufacturerObjectId, status: 1 })
        .exec(),
      this.mappingModel
        .countDocuments({
          manufacturerId: manufacturerObjectId,
          vendorUserId,
          status: 1,
        })
        .exec()
        .then((c) => c > 0),
    ]);
    if (!user) throw new NotFoundException('Staff user not found');
    if (user.type !== 'staff') {
      throw new BadRequestException('Role assignment only allowed for staff');
    }
    if (!role) throw new NotFoundException('Role not found');

    const mapping = await this.mappingModel
      .findOneAndUpdate(
        { manufacturerId: manufacturerObjectId, vendorUserId, roleId },
        { $set: { status: 1 } },
        { upsert: true, new: true },
      )
      .exec();

    if (!hadAnyRoleBefore) {
      await this.sendFirstRoleAssignmentCredentialsIfNeeded({
        manufacturerId,
        vendorUserId,
        user,
      });
    }
    await this.invalidateRbacCache(manufacturerId);
    return mapping;
  }

  async updateStaffRole(manufacturerId: string, dto: AssignRoleDto) {
    if (!dto.roleId) {
      throw new BadRequestException('roleId is required');
    }
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
    const roleId = this.toObjectId(dto.roleId, 'roleId');

    const [role, user, hadAnyRoleBefore] = await Promise.all([
      this.roleModel
        .findOne({ _id: roleId, manufacturerId: manufacturerObjectId, status: 1 })
        .exec(),
      this.vendorUserModel
        .findOne({ _id: vendorUserId, manufacturerId: manufacturerObjectId })
        .exec(),
      this.mappingModel
        .countDocuments({
          manufacturerId: manufacturerObjectId,
          vendorUserId,
          status: 1,
        })
        .exec()
        .then((c) => c > 0),
    ]);
    if (!role) throw new NotFoundException('Role not found');
    if (!user) throw new NotFoundException('Staff user not found');
    if (user.type !== 'staff') {
      throw new BadRequestException('Role assignment only allowed for staff');
    }

    await this.mappingModel.deleteMany({
      manufacturerId: manufacturerObjectId,
      vendorUserId,
    });
    const mapping = await this.mappingModel.create({
      manufacturerId: manufacturerObjectId,
      vendorUserId,
      roleId,
      status: 1,
    });

    if (!hadAnyRoleBefore) {
      await this.sendFirstRoleAssignmentCredentialsIfNeeded({
        manufacturerId,
        vendorUserId,
        user,
      });
    }
    await this.invalidateRbacCache(manufacturerId);
    return mapping;
  }

  async replaceStaffRoles(
    manufacturerId: string,
    dto: { vendorUserId: string; roleIds: string[] },
  ) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
    const roleIds = Array.from(new Set((dto.roleIds || []).map((r) => String(r))));
    const roleObjectIds = roleIds.map((id) => this.toObjectId(id, 'roleIds'));

    const [user, hadAnyRoleBefore] = await Promise.all([
      this.vendorUserModel
        .findOne({ _id: vendorUserId, manufacturerId: manufacturerObjectId })
        .exec(),
      this.mappingModel
        .countDocuments({
          manufacturerId: manufacturerObjectId,
          vendorUserId,
          status: 1,
        })
        .exec()
        .then((c) => c > 0),
    ]);
    if (!user) throw new NotFoundException('Staff user not found');
    if (user.type !== 'staff') {
      throw new BadRequestException('Role assignment only allowed for staff');
    }

    if (roleObjectIds.length > 0) {
      const validRolesCount = await this.roleModel
        .countDocuments({
          _id: { $in: roleObjectIds },
          manufacturerId: manufacturerObjectId,
          status: 1,
        })
        .exec();
      if (validRolesCount !== roleObjectIds.length) {
        throw new NotFoundException('One or more roles not found');
      }
    }

    const session = await this.mappingModel.db.startSession();
    try {
      let createdCount = 0;
      await session.withTransaction(async () => {
        await this.mappingModel
          .deleteMany({
            manufacturerId: manufacturerObjectId,
            vendorUserId,
          })
          .session(session)
          .exec();

        if (roleObjectIds.length > 0) {
          await this.mappingModel.insertMany(
            roleObjectIds.map((roleId) => ({
              manufacturerId: manufacturerObjectId,
              vendorUserId,
              roleId,
              status: 1,
            })),
            { session, ordered: true },
          );
          createdCount = roleObjectIds.length;
        }
      });

      if (!hadAnyRoleBefore && createdCount > 0) {
        await this.sendFirstRoleAssignmentCredentialsIfNeeded({
          manufacturerId,
          vendorUserId,
          user,
        });
      }

      await this.invalidateRbacCache(manufacturerId);
      return {
        vendorUserId: String(vendorUserId),
        roleIds,
        createdCount,
      };
    } finally {
      await session.endSession();
    }
  }

  async unassignStaffRole(manufacturerId: string, vendorUserId: string) {
    const manufacturerObjectId = this.toObjectId(
      manufacturerId,
      'manufacturerId',
    );
    const vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');

    const res = await this.mappingModel
      .deleteMany({
        manufacturerId: manufacturerObjectId,
        vendorUserId: vendorUserObjectId,
      })
      .exec();

    await this.invalidateRbacCache(manufacturerId);
    return {
      vendorUserId,
      deletedCount: res?.deletedCount ?? 0,
    };
  }

  async getStaffWithRoles(manufacturerId: string, vendorUserId?: string) {
    const cacheKey = this.redisService.buildKey(
      'rbac',
      manufacturerId,
      'staff-roles',
      vendorUserId || 'all',
    );
    try {
      const cached = await this.redisService.get<Record<string, unknown>[]>(cacheKey);
      if (Array.isArray(cached)) return cached;
    } catch (error) {
      this.logger.warn(
        `RBAC staff-roles cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

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

    const mapped = rows.map((row: Record<string, unknown>) => {
      const role = row.roleId as
        | { permissions?: string[]; status?: number; [k: string]: unknown }
        | null
        | undefined;
      const vendorUser = row.vendorUserId as
        | { _id?: Types.ObjectId | string; [k: string]: unknown }
        | null
        | undefined;
      const roleActive = role && role.status !== 0;
      const raw = roleActive
        ? this.normalizePermissions(role!.permissions || [])
        : [];
      const effective = roleActive ? this.effectivePermissionsFromRaw(raw) : [];
      const roleIdValue =
        role && typeof role === 'object'
          ? String((role as any)._id ?? '')
          : String(row.roleId ?? '');
      const vendorUserIdValue =
        vendorUser && typeof vendorUser === 'object'
          ? String((vendorUser as any)._id ?? '')
          : String(row.vendorUserId ?? '');
      const roleIdPayload =
        role && typeof role === 'object'
          ? { ...role, effectivePermissions: effective }
          : role;
      return {
        ...row,
        vendorUserId: vendorUserIdValue,
        roleId: roleIdValue,
        vendorUser,
        role: roleIdPayload,
        effectivePermissions: effective,
      };
    });
    this.redisService
      .set(cacheKey, mapped, this.getRbacCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `RBAC staff-roles cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return mapped;
  }

  async getStaffPermissions(
    manufacturerId: string,
    vendorUserId: string,
  ): Promise<string[]> {
    const cacheKey = this.redisService.buildKey(
      'rbac',
      manufacturerId,
      'staff-permissions',
      vendorUserId,
    );
    try {
      const cached = await this.redisService.get<string[]>(cacheKey);
      if (Array.isArray(cached)) return cached;
    } catch (error) {
      this.logger.warn(
        `RBAC staff-permissions cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

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
    const minimized = minimizePermissionSet(Array.from(permissions));
    this.redisService
      .set(cacheKey, minimized, this.getRbacCacheTtlSeconds())
      .catch((error) => {
        this.logger.warn(
          `RBAC staff-permissions cache write failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
    return minimized;
  }
}

