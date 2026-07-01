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
import { ListRolesQueryDto } from './dto/list-roles-query.dto';
import { VendorUsersService } from '../vendor-users/vendor-users.service';
import {
  expandEffectivePermissions,
  minimizePermissionSet,
} from '../common/permissions/permission-hierarchy';
import { ALL_KNOWN_PERMISSION_VALUES } from '../common/constants/permissions.constants';
import { isPlatformAdminUser } from '../common/utils/platform-admin.util';
import { EmailService } from '../common/services/email.service';
import { RedisService } from '../common/redis/redis.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import {
  platformRbacScopeDocument,
  rbacScopeFilter,
  resolveRbacCacheScope,
  platformPortalUserManufacturerFilter,
} from '../common/utils/platform-rbac-scope.util';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Tenant RBAC: **Role** documents hold `permissions[]`. **StaffRoleMapping** links staff
 * `VendorUser` ↔ `Role` (many-to-many). Effective rights are always derived from current
 * role rows + active mappings — nothing permission-related is snapshotted on the user.
 *
 * **Caching:** `getStaffPermissions` caches a minimized grant union per user (`RBAC_CACHE_TTL_SECONDS`).
 * Call `invalidateRbacCache` whenever role definitions or assignments change so checks stay fresh.
 *
 * **JWT:** Access tokens carry identity (`userId`, `manufacturerId`, `role` type only), not permission
 * claims. `PermissionsGuard` resolves grants via `getStaffPermissions` on each request (subject to cache TTL).
 */
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

  private async invalidateRbacCache(manufacturerId?: string | null): Promise<void> {
    const scope = resolveRbacCacheScope(manufacturerId);
    await this.redisService
      .deleteByPattern(this.redisService.buildKey('rbac', scope, '*'))
      .catch((error) => {
        this.logger.warn(
          `RBAC cache invalidation failed for scope=${scope}: ${(error as Error)?.message || 'unknown error'}`,
        );
      });
  }

  private rbacScope(manufacturerId?: string | null): Record<string, unknown> {
    return rbacScopeFilter(manufacturerId);
  }

  private scopeDocument(manufacturerId?: string | null): {
    manufacturerId: Types.ObjectId | null;
  } {
    const id = String(manufacturerId ?? '').trim();
    if (!id) {
      return platformRbacScopeDocument();
    }
    return { manufacturerId: new Types.ObjectId(id) };
  }

  async hasAnyActiveStaffRoleMapping(
    manufacturerId: string | undefined | null,
    vendorUserId: string,
  ): Promise<boolean> {
    const vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');
    const count = await this.mappingModel
      .countDocuments({
        ...this.rbacScope(manufacturerId),
        vendorUserId: vendorUserObjectId,
        status: 1,
      })
      .exec();
    return count > 0;
  }

  private toObjectId(id: string, field: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${field}`);
    }
    return new Types.ObjectId(id);
  }

  private async findStaffUserById(
    vendorUserId: Types.ObjectId,
  ): Promise<VendorUserDocument | null> {
    return this.vendorUserModel
      .findOne({
        _id: vendorUserId,
        type: 'staff',
        ...platformPortalUserManufacturerFilter(),
      })
      .exec();
  }

  private async sendFirstRoleAssignmentCredentialsIfNeeded(input: {
    manufacturerId?: string | null;
    vendorUserId: Types.ObjectId;
    user: VendorUserDocument;
  }): Promise<{ temporaryPassword: string; email: string } | undefined> {
    const email = String(input.user.email ?? '').trim().toLowerCase();
    const name = String(input.user.name ?? '').trim();
    if (!email) return undefined;

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

    return { temporaryPassword: password, email };
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

  async createRole(manufacturerId: string | undefined | null, dto: CreateRoleDto) {
    try {
      const role = await this.roleModel.create({
        ...this.scopeDocument(manufacturerId),
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

  private buildRolesSort(
    sort?: ListRolesQueryDto['sort'],
    order?: ListRolesQueryDto['order'],
  ): Record<string, 1 | -1> {
    const dir = (o?: ListRolesQueryDto['order']): 1 | -1 =>
      o === 'asc' ? 1 : -1;
    if (!sort) {
      return { createdAt: -1, _id: 1 };
    }
    const primary =
      sort === 'name'
        ? dir(order ?? 'asc')
        : sort === 'id'
          ? dir(order ?? 'desc')
          : dir(order ?? 'desc');
    switch (sort) {
      case 'name':
        return { name: primary, _id: 1 };
      case 'id':
        return { _id: primary };
      case 'createdAt':
        return { createdAt: primary, _id: 1 };
      default:
        return { createdAt: -1, _id: 1 };
    }
  }

  /**
   * List roles for a manufacturer.
   * - No `page`/`limit` and no `search`: full list (Redis-cached), backward compatible.
   * - `page` and/or `limit` set: paged DB query; caller should return `{ success, data, total, page, limit }`.
   * - `search` only: all matches, no cache.
   */
  async listRoles(
    manufacturerId: string | undefined | null,
    query?: ListRolesQueryDto,
  ): Promise<{
    paged: boolean;
    data: Record<string, unknown>[];
    total: number;
    page?: number;
    limit?: number;
  }> {
    const search = query?.search?.trim();
    const pagingRequested =
      query?.page !== undefined || query?.limit !== undefined;
    const sortSpec = this.buildRolesSort(query?.sort, query?.order);

    const filter: Record<string, unknown> = { ...this.rbacScope(manufacturerId) };
    if (search) {
      const rx = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: rx }, { description: rx }, { permissions: rx }];
    }

    const sortOrOrder =
      query?.sort !== undefined ||
      (query?.order !== undefined && String(query.order).trim() !== '');

    if (!pagingRequested && !search && !sortOrOrder) {
      const cacheKey = this.redisService.buildKey(
        'rbac',
        resolveRbacCacheScope(manufacturerId),
        'roles',
        'list',
      );
      try {
        const cached = await this.redisService.get<Record<string, unknown>[]>(
          cacheKey,
        );
        if (Array.isArray(cached)) {
          return { paged: false, data: cached, total: cached.length };
        }
      } catch (error) {
        this.logger.warn(
          `RBAC roles cache read failed: ${(error as Error)?.message || 'unknown error'}`,
        );
      }

      const rows = await this.roleModel
        .find(this.rbacScope(manufacturerId))
        .sort(sortSpec)
        .lean()
        .exec();
      this.redisService
        .set(cacheKey, rows, this.getRbacCacheTtlSeconds())
        .catch((error) => {
          this.logger.warn(
            `RBAC roles cache write failed: ${(error as Error)?.message || 'unknown error'}`,
          );
        });
      return { paged: false, data: rows, total: rows.length };
    }

    if (!pagingRequested && search) {
      const rows = await this.roleModel
        .find(filter)
        .sort(sortSpec)
        .lean()
        .exec();
      return { paged: false, data: rows, total: rows.length };
    }

    const page = Math.max(1, query?.page ?? 1);
    const limit = Math.min(100, Math.max(1, query?.limit ?? 10));
    const skip = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      this.roleModel.countDocuments(filter).exec(),
      this.roleModel
        .find(filter)
        .sort(sortSpec)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      paged: true,
      data: rows,
      total,
      page,
      limit,
    };
  }

  async updateRole(
    manufacturerId: string | undefined | null,
    roleId: string,
    dto: UpdateRoleDto,
  ) {
    const roleObjectId = this.toObjectId(roleId, 'roleId');
    const updateDoc: Record<string, unknown> = {};
    if (dto.name !== undefined) updateDoc.name = dto.name.trim();
    if (dto.description !== undefined) updateDoc.description = dto.description.trim();
    if (dto.permissions !== undefined) {
      updateDoc.permissions = this.normalizePermissions(dto.permissions);
    }

    const row = await this.roleModel
      .findOneAndUpdate(
        { _id: roleObjectId, ...this.rbacScope(manufacturerId) },
        { $set: updateDoc },
        { new: true },
      )
      .exec();
    if (!row) throw new NotFoundException('Role not found');
    await this.invalidateRbacCache(manufacturerId);
    return row;
  }

  async disableRole(manufacturerId: string | undefined | null, roleId: string) {
    return this.setOrToggleRoleStatus(manufacturerId, roleId, 0);
  }

  async setOrToggleRoleStatus(
    manufacturerId: string | undefined | null,
    roleId: string,
    status?: number,
  ) {
    const roleObjectId = this.toObjectId(roleId, 'roleId');

    let nextStatus: number;
    if (status === 0 || status === 1) {
      nextStatus = status;
    } else {
      const current = await this.roleModel
        .findOne({ _id: roleObjectId, ...this.rbacScope(manufacturerId) })
        .select('status')
        .lean()
        .exec();
      if (!current) throw new NotFoundException('Role not found');
      nextStatus = Number((current as any).status) === 1 ? 0 : 1;
    }

    const row = await this.roleModel
      .findOneAndUpdate(
        { _id: roleObjectId, ...this.rbacScope(manufacturerId) },
        { $set: { status: nextStatus } },
        { new: true },
      )
      .lean()
      .exec();
    if (!row) throw new NotFoundException('Role not found');

    await this.invalidateRbacCache(manufacturerId);
    return {
      id: String((row as any)._id),
      status: Number((row as any).status) === 1 ? 'active' : 'inactive',
      is_active: Number((row as any).status) === 1,
    };
  }

  async deleteRole(manufacturerId: string | undefined | null, roleId: string) {
    const roleObjectId = this.toObjectId(roleId, 'roleId');

    const role = await this.roleModel
      .findOne({ _id: roleObjectId, ...this.rbacScope(manufacturerId) })
      .select('_id name')
      .lean()
      .exec();
    if (!role) throw new NotFoundException('Role not found');

    const activeMappingsCount = await this.mappingModel
      .countDocuments({
        ...this.rbacScope(manufacturerId),
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
      .deleteOne({ _id: roleObjectId, ...this.rbacScope(manufacturerId) })
      .exec();
    if (!res || res.deletedCount === 0) {
      throw new NotFoundException('Role not found');
    }

    await this.mappingModel
      .deleteMany({
        ...this.rbacScope(manufacturerId),
        roleId: roleObjectId,
      })
      .exec();

    await this.invalidateRbacCache(manufacturerId);
    return { id: String(roleObjectId), name: String((role as any).name ?? '') };
  }

  async createStaff(_manufacturerId: string | undefined | null, dto: CreateStaffDto) {
    const existing = await this.vendorUsersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already exists');

    const createdStaff = await this.vendorUsersService.create({
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

    await this.invalidateRbacCache(undefined);
    return createdStaff;
  }

  async listStaff(manufacturerId?: string | null) {
    const cacheKey = this.redisService.buildKey(
      'rbac',
      resolveRbacCacheScope(manufacturerId),
      'staff',
      'list',
    );
    try {
      const cached = await this.redisService.get<Record<string, unknown>[]>(cacheKey);
      if (Array.isArray(cached)) return cached;
    } catch (error) {
      this.logger.warn(
        `RBAC staff cache read failed: ${(error as Error)?.message || 'unknown error'}`,
      );
    }

    const rows = await this.vendorUserModel
      .find({
        type: 'staff',
        status: { $ne: 2 },
        ...platformPortalUserManufacturerFilter(),
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

  async assignRole(manufacturerId: string | undefined | null, dto: AssignRoleDto) {
    const vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
    if (!dto.roleId) {
      throw new BadRequestException('roleId is required');
    }
    const roleId = this.toObjectId(dto.roleId, 'roleId');
    const scopeDoc = this.scopeDocument(manufacturerId);

    const [user, role, hadAnyRoleBefore] = await Promise.all([
      this.findStaffUserById(vendorUserId),
      this.roleModel
        .findOne({ _id: roleId, ...this.rbacScope(manufacturerId), status: 1 })
        .exec(),
      this.mappingModel
        .countDocuments({
          ...this.rbacScope(manufacturerId),
          vendorUserId,
          status: 1,
        })
        .exec()
        .then((c) => c > 0),
    ]);
    if (!user) throw new NotFoundException('Staff user not found');
    if (!role) throw new NotFoundException('Role not found');

    const mapping = await this.mappingModel
      .findOneAndUpdate(
        { ...scopeDoc, vendorUserId, roleId },
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

  async updateStaffRole(
    manufacturerId: string | undefined | null,
    dto: AssignRoleDto,
  ) {
    if (!dto.roleId) {
      throw new BadRequestException('roleId is required');
    }
    const vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
    const roleId = this.toObjectId(dto.roleId, 'roleId');
    const scopeDoc = this.scopeDocument(manufacturerId);

    const [role, user, hadAnyRoleBefore] = await Promise.all([
      this.roleModel
        .findOne({ _id: roleId, ...this.rbacScope(manufacturerId), status: 1 })
        .exec(),
      this.findStaffUserById(vendorUserId),
      this.mappingModel
        .countDocuments({
          ...this.rbacScope(manufacturerId),
          vendorUserId,
          status: 1,
        })
        .exec()
        .then((c) => c > 0),
    ]);
    if (!role) throw new NotFoundException('Role not found');
    if (!user) throw new NotFoundException('Staff user not found');

    await this.mappingModel.deleteMany({
      ...this.rbacScope(manufacturerId),
      vendorUserId,
    });
    const mapping = await this.mappingModel.create({
      ...scopeDoc,
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
    manufacturerId: string | undefined | null,
    dto: { vendorUserId: string; roleIds: string[] },
  ) {
    const vendorUserId = this.toObjectId(dto.vendorUserId, 'vendorUserId');
    const roleIds = Array.from(new Set((dto.roleIds || []).map((r) => String(r))));
    const roleObjectIds = roleIds.map((id) => this.toObjectId(id, 'roleIds'));
    const scopeDoc = this.scopeDocument(manufacturerId);

    const [user, hadAnyRoleBefore] = await Promise.all([
      this.findStaffUserById(vendorUserId),
      this.mappingModel
        .countDocuments({
          ...this.rbacScope(manufacturerId),
          vendorUserId,
          status: 1,
        })
        .exec()
        .then((c) => c > 0),
    ]);
    if (!user) throw new NotFoundException('Staff user not found');

    if (roleObjectIds.length > 0) {
      const validRolesCount = await this.roleModel
        .countDocuments({
          _id: { $in: roleObjectIds },
          ...this.rbacScope(manufacturerId),
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
            ...this.rbacScope(manufacturerId),
            vendorUserId,
          })
          .session(session)
          .exec();

        if (roleObjectIds.length > 0) {
          await this.mappingModel.insertMany(
            roleObjectIds.map((roleId) => ({
              ...scopeDoc,
              vendorUserId,
              roleId,
              status: 1,
            })),
            { session, ordered: true },
          );
          createdCount = roleObjectIds.length;
        }
      });

      let credentialDelivery:
        | { temporaryPassword: string; email: string }
        | undefined;
      if (!hadAnyRoleBefore && createdCount > 0) {
        credentialDelivery = await this.sendFirstRoleAssignmentCredentialsIfNeeded({
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
        ...(credentialDelivery
          ? {
              temporaryPassword: credentialDelivery.temporaryPassword,
              email: credentialDelivery.email,
            }
          : {}),
      };
    } finally {
      await session.endSession();
    }
  }

  async unassignStaffRole(
    manufacturerId: string | undefined | null,
    vendorUserId: string,
  ) {
    const vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');

    const res = await this.mappingModel
      .deleteMany({
        ...this.rbacScope(manufacturerId),
        vendorUserId: vendorUserObjectId,
      })
      .exec();

    await this.invalidateRbacCache(manufacturerId);
    return {
      vendorUserId,
      deletedCount: res?.deletedCount ?? 0,
    };
  }

  async getStaffWithRoles(
    manufacturerId?: string | null,
    vendorUserId?: string,
  ) {
    const cacheKey = this.redisService.buildKey(
      'rbac',
      resolveRbacCacheScope(manufacturerId),
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

    const where: Record<string, unknown> = {
      ...this.rbacScope(manufacturerId),
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

  private async vendorUserIsPlatformAdmin(vendorUserId: string): Promise<boolean> {
    const vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');
    const user = await this.vendorUserModel
      .findById(vendorUserObjectId)
      .select('type')
      .lean()
      .exec();
    return isPlatformAdminUser({ type: user?.type });
  }

  /** Full grant list for platform admin users (unrestricted portal). */
  allPlatformAdminGrants(): string[] {
    return minimizePermissionSet([...ALL_KNOWN_PERMISSION_VALUES]);
  }

  async getStaffPermissions(
    manufacturerId: string | undefined | null,
    vendorUserId: string,
  ): Promise<string[]> {
    if (await this.vendorUserIsPlatformAdmin(vendorUserId)) {
      return this.allPlatformAdminGrants();
    }

    const cacheKey = this.redisService.buildKey(
      'rbac',
      resolveRbacCacheScope(manufacturerId),
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

    const vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');
    const mappings = await this.mappingModel
      .find({
        ...this.rbacScope(manufacturerId),
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

  /**
   * Admin / staff UI: **union** of all assigned roles’ grants, expanded to known permission keys.
   * Always reflects current `Role.permissions` in the database (same source as `getStaffPermissions` + guard).
   */
  async getStaffPermissionContext(
    manufacturerId: string | undefined | null,
    vendorUserId: string,
  ): Promise<{
    roleIds: string[];
    grants: string[];
    effectivePermissions: string[];
    isPlatformAdmin: boolean;
  }> {
    if (await this.vendorUserIsPlatformAdmin(vendorUserId)) {
      const grants = this.allPlatformAdminGrants();
      return {
        roleIds: [],
        grants,
        effectivePermissions: this.effectivePermissionsFromRaw(grants),
        isPlatformAdmin: true,
      };
    }

    const vendorUserObjectId = this.toObjectId(vendorUserId, 'vendorUserId');

    const [grants, mappings] = await Promise.all([
      this.getStaffPermissions(manufacturerId, vendorUserId),
      this.mappingModel
        .find({
          ...this.rbacScope(manufacturerId),
          vendorUserId: vendorUserObjectId,
          status: 1,
        })
        .select('roleId')
        .lean()
        .exec(),
    ]);

    const roleIds = mappings.map((m) => String(m.roleId));
    const effectivePermissions = this.effectivePermissionsFromRaw(grants);

    return {
      roleIds,
      grants,
      effectivePermissions,
      isPlatformAdmin: false,
    };
  }
}

