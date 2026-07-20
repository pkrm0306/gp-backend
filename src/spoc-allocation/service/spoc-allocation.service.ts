import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { PRODUCT_STATUS_CERTIFIED } from '../../renew/constants/product-status.constants';
import { AssignSpocDto, ReassignSpocInput } from '../dto/assign-spoc.dto';
import { SpocAllocationEmailService } from '../email/spoc-allocation-email.service';
import {
  SpocAllocationDocument,
} from '../models/spoc-allocation.model';
import { SpocAllocationRepository } from '../repository/spoc-allocation.repository';
import { throwSpocValidationError } from '../validation/spoc-allocation.validation';

@Injectable()
export class SpocAllocationService {
  constructor(
    private readonly repository: SpocAllocationRepository,
    private readonly spocEmail: SpocAllocationEmailService,
  ) {}

  private toObjectId(id: string, field: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throwSpocValidationError(`Invalid ${field}`, {
        [field]: `Invalid ${field}`,
      });
    }
    return new Types.ObjectId(id);
  }

  /**
   * Active GreenPro team members: `type=staff` and `status=1`
   * (same active rule as Team Member admin list).
   */
  async listActiveTeamMembers() {
    const members = await this.repository.listActiveStaffMembers();

    return (members ?? []).map((m, index) => ({
      s_no: index + 1,
      id: String(m._id),
      name: String(m.name ?? ''),
      email: String(m.email ?? ''),
      phone: String(m.phone ?? ''),
      designation: String(m.designation ?? ''),
      is_active: true,
      displayOrder:
        typeof (m as { displayOrder?: number }).displayOrder === 'number'
          ? (m as { displayOrder: number }).displayOrder
          : null,
    }));
  }

  /**
   * Only active GreenPro team members (`type=staff`, `status=1`) may be assigned.
   */
  private async requireActiveTeamMember(spocId: string) {
    const id = this.toObjectId(spocId, 'spocId');
    const member = await this.repository.findTeamMemberById(id);

    if (!member) {
      throwSpocValidationError('Team member not found', {
        spocId: 'Team member not found',
      });
    }

    const type = String((member as { type?: string }).type ?? '').trim();
    if (type !== 'staff') {
      throwSpocValidationError(
        'Only active team members can be assigned as SPOC',
        {
          spocId: 'Only active team members can be assigned as SPOC',
        },
      );
    }

    const status = Number((member as { status?: number }).status ?? 0);
    if (status !== 1) {
      throwSpocValidationError(
        'Only active team members can be assigned as SPOC',
        {
          spocId: 'Only active team members can be assigned as SPOC',
        },
      );
    }

    return member;
  }

  /**
   * Product must exist and must not be Certified (`productStatus === 2`).
   */
  private async requireAssignableProduct(productId: number) {
    if (!Number.isFinite(productId) || productId < 1) {
      throwSpocValidationError('Invalid productId', {
        productId: 'productId must be a positive integer',
      });
    }

    const product = await this.repository.findAssignableProduct(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const productStatus = Number(
      (product as { productStatus?: number }).productStatus ?? 0,
    );
    if (productStatus === PRODUCT_STATUS_CERTIFIED) {
      throwSpocValidationError('Product must not be Certified', {
        productId: 'Product must not be Certified',
      });
    }
    return product as {
      productId: number;
      urnNo?: string;
      productName?: string;
      vendorId?: Types.ObjectId;
      manufacturerId?: Types.ObjectId;
      productStatus?: number;
    };
  }

  private resolveVendorId(
    product: {
      vendorId?: Types.ObjectId;
      manufacturerId?: Types.ObjectId;
    },
    dtoVendorId?: string,
  ): Types.ObjectId {
    if (dtoVendorId) {
      return this.toObjectId(dtoVendorId, 'vendorId');
    }
    const fromProduct = product.manufacturerId ?? product.vendorId;
    if (!fromProduct) {
      throwSpocValidationError('Product has no vendor/manufacturer id', {
        vendorId: 'Product has no vendor/manufacturer id',
      });
    }
    return new Types.ObjectId(String(fromProduct));
  }

  private async resolveVendorName(vendorId: Types.ObjectId): Promise<string> {
    const manufacturer = await this.repository.findManufacturerName(vendorId);
    if (!manufacturer) return '';
    return String(
      manufacturer.manufacturerName || manufacturer.vendor_name || '',
    ).trim();
  }

  private serializeTeamMember(
    member:
      | {
          _id?: unknown;
          name?: string;
          email?: string;
          phone?: string;
          designation?: string;
        }
      | null
      | undefined,
  ) {
    if (!member) return null;
    return {
      id: String(member._id),
      name: String(member.name ?? ''),
      email: String(member.email ?? ''),
      phone: String(member.phone ?? ''),
      designation: String(member.designation ?? ''),
    };
  }

  private serializeAllocation(
    doc: SpocAllocationDocument | Record<string, unknown>,
    spoc?: {
      _id?: unknown;
      name?: string;
      email?: string;
      phone?: string;
      designation?: string;
    } | null,
  ) {
    const row = doc as Record<string, unknown>;
    return {
      id: String(row._id),
      productId: Number(row.productId),
      urn: String(row.urn ?? ''),
      vendorId: String(row.vendorId ?? ''),
      spocId: String(row.spocId ?? ''),
      spoc: this.serializeTeamMember(spoc),
      assignedBy: String(row.assignedBy ?? ''),
      assignedAt: row.assignedAt,
      updatedAt: row.updatedAt,
      isActive: row.isActive === true,
    };
  }

  /** Active allocation for a product, or null when none. */
  async getAssignedSpocByProduct(productId: number) {
    if (!Number.isFinite(productId) || productId < 1) {
      throwSpocValidationError('Invalid productId', {
        productId: 'productId must be a positive integer',
      });
    }

    const allocation = await this.repository.findActiveAllocationByProductId(
      productId,
      true,
    );
    if (!allocation) {
      return null;
    }

    const spoc = await this.repository.findTeamMemberById(
      new Types.ObjectId(String(allocation.spocId)),
    );

    return this.serializeAllocation(allocation, spoc);
  }

  /**
   * Batch lookup of active SPOC display names by business product ids.
   * Products with no active allocation are omitted (caller treats as empty).
   */
  async lookupAssignedSpocNames(productIds: number[]) {
    const ids = [
      ...new Set(
        (productIds ?? [])
          .map((id) => Number(id))
          .filter((id) => Number.isFinite(id) && id >= 1)
          .map((id) => Math.trunc(id)),
      ),
    ].slice(0, 500);

    if (ids.length === 0) {
      return [] as Array<{ productId: number; spocName: string }>;
    }

    const allocations =
      await this.repository.findActiveAllocationsByProductIds(ids);

    if (!allocations.length) {
      return [] as Array<{ productId: number; spocName: string }>;
    }

    const spocObjectIds = [
      ...new Set(
        allocations
          .map((row) => String(row.spocId ?? '').trim())
          .filter((id) => Types.ObjectId.isValid(id)),
      ),
    ].map((id) => new Types.ObjectId(id));

    const members = await this.repository.findStaffNamesByIds(spocObjectIds);

    const nameBySpocId = new Map(
      (members ?? []).map((m) => [
        String(m._id),
        String(m.name ?? '').trim(),
      ]),
    );

    return allocations.map((row) => ({
      productId: Number(row.productId),
      spocName: nameBySpocId.get(String(row.spocId)) || '',
    }));
  }

  async assign(dto: AssignSpocDto, actorId: string) {
    const product = await this.requireAssignableProduct(dto.productId);
    const urn =
      String(dto.urn ?? '').trim() || String(product.urnNo ?? '').trim();
    if (!urn) {
      throwSpocValidationError('URN is required', {
        urn: 'URN is required',
      });
    }

    const existing = await this.repository.findActiveAllocationSummary(
      dto.productId,
    );
    if (existing) {
      if (String(existing.spocId) === String(dto.spocId).trim()) {
        throwSpocValidationError(
          'This SPOC is already assigned to this product',
          {
            spocId: 'This SPOC is already assigned to this product',
          },
        );
      }
      throw new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        code: 'SPOC_ALREADY_ASSIGNED',
        message: 'Product already has an active SPOC. Use reassign instead.',
        fieldErrors: {
          productId:
            'Product already has an active SPOC. Use reassign instead.',
        },
      });
    }

    const spocMember = await this.requireActiveTeamMember(dto.spocId);
    const vendorId = this.resolveVendorId(product, dto.vendorId);
    const vendorName = await this.resolveVendorName(vendorId);
    const productName = String(product.productName ?? '').trim();
    const spocId = new Types.ObjectId(String(spocMember._id));
    const assignedBy = this.toObjectId(actorId, 'assignedBy');
    const now = new Date();

    const created = await this.repository.createAllocation({
      productId: dto.productId,
      urn,
      vendorId,
      spocId,
      assignedBy,
      assignedAt: now,
      updatedAt: now,
      isActive: true,
    });

    const history = await this.repository.createHistory({
      allocationId: created._id as Types.ObjectId,
      previousSpoc: null,
      newSpoc: spocId,
      changedBy: assignedBy,
      remarks: String(dto.remarks ?? '').trim(),
      createdAt: now,
      emailNotifiedAt: null,
    });

    this.spocEmail.notifyAfterSuccess({
      historyId: history._id as Types.ObjectId,
      kind: 'assign',
      spocEmail: spocMember.email,
      spocName: spocMember.name,
      urn,
      productName,
      vendorName,
    });

    return this.serializeAllocation(created.toObject(), spocMember);
  }

  async reassign(dto: ReassignSpocInput, actorId: string) {
    const product = await this.requireAssignableProduct(dto.productId);

    const existing = (await this.repository.findActiveAllocationByProductId(
      dto.productId,
      false,
    )) as SpocAllocationDocument | null;
    if (!existing) {
      throw new NotFoundException(
        'No active SPOC allocation found. Use assign instead.',
      );
    }

    const spocMember = await this.requireActiveTeamMember(dto.spocId);
    const newSpocId = new Types.ObjectId(String(spocMember._id));
    if (String(existing.spocId) === String(newSpocId)) {
      throwSpocValidationError(
        'This SPOC is already assigned to this product',
        {
          spocId: 'This SPOC is already assigned to this product',
        },
      );
    }

    const previousSpoc = existing.spocId;
    const changedBy = this.toObjectId(actorId, 'changedBy');
    const now = new Date();
    const urn = String(existing.urn ?? product.urnNo ?? '').trim();
    const productName = String(product.productName ?? '').trim();
    const vendorName = await this.resolveVendorName(
      new Types.ObjectId(String(existing.vendorId)),
    );

    existing.spocId = newSpocId;
    existing.assignedBy = changedBy;
    existing.assignedAt = now;
    existing.updatedAt = now;
    await existing.save();

    const history = await this.repository.createHistory({
      allocationId: existing._id as Types.ObjectId,
      previousSpoc,
      newSpoc: newSpocId,
      changedBy,
      remarks: String(dto.remarks ?? '').trim(),
      createdAt: now,
      emailNotifiedAt: null,
    });

    this.spocEmail.notifyAfterSuccess({
      historyId: history._id as Types.ObjectId,
      kind: 'reassign',
      spocEmail: spocMember.email,
      spocName: spocMember.name,
      urn,
      productName,
      vendorName,
    });

    return this.serializeAllocation(existing.toObject(), spocMember);
  }
}
