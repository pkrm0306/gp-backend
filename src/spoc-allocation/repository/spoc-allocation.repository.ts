import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Manufacturer,
  ManufacturerDocument,
} from '../../manufacturers/schemas/manufacturer.schema';
import { matchActiveProducts } from '../../product-registration/constants/active-product.filter';
import {
  Product,
  ProductDocument,
} from '../../product-registration/schemas/product.schema';
import {
  VendorUser,
  VendorUserDocument,
} from '../../vendor-users/schemas/vendor-user.schema';
import {
  SpocAllocation,
  SpocAllocationDocument,
} from '../models/spoc-allocation.model';
import {
  SpocAllocationHistory,
  SpocAllocationHistoryDocument,
} from '../models/spoc-allocation-history.model';

/**
 * Data-access layer for SPOC allocations (isolated from Product write APIs).
 */
@Injectable()
export class SpocAllocationRepository {
  constructor(
    @InjectModel(SpocAllocation.name)
    private readonly allocationModel: Model<SpocAllocationDocument>,
    @InjectModel(SpocAllocationHistory.name)
    private readonly historyModel: Model<SpocAllocationHistoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Manufacturer.name)
    private readonly manufacturerModel: Model<ManufacturerDocument>,
    @InjectModel(VendorUser.name)
    private readonly vendorUserModel: Model<VendorUserDocument>,
  ) {}

  listActiveStaffMembers() {
    return this.vendorUserModel
      .find({ type: 'staff', status: 1 })
      .select('name email phone designation status displayOrder')
      .sort({ displayOrder: 1, name: 1 })
      .lean()
      .exec();
  }

  findTeamMemberById(id: Types.ObjectId) {
    return this.vendorUserModel
      .findById(id)
      .select('_id name email phone designation status type')
      .lean()
      .exec();
  }

  findStaffNamesByIds(ids: Types.ObjectId[]) {
    if (!ids.length) return Promise.resolve([]);
    return this.vendorUserModel
      .find({ _id: { $in: ids } })
      .select('_id name')
      .lean()
      .exec();
  }

  findAssignableProduct(productId: number) {
    return this.productModel
      .findOne(matchActiveProducts({ productId }))
      .select(
        'productId urnNo productName vendorId manufacturerId productStatus',
      )
      .lean()
      .exec();
  }

  findManufacturerName(vendorId: Types.ObjectId) {
    return this.manufacturerModel
      .findById(vendorId)
      .select('manufacturerName vendor_name')
      .lean()
      .exec();
  }

  findActiveAllocationByProductId(productId: number, lean = true) {
    const q = this.allocationModel.findOne({ productId, isActive: true });
    return lean ? q.lean().exec() : q.exec();
  }

  findActiveAllocationSummary(productId: number) {
    return this.allocationModel
      .findOne({ productId, isActive: true })
      .select('_id spocId')
      .lean()
      .exec();
  }

  findActiveAllocationsByProductIds(productIds: number[]) {
    return this.allocationModel
      .find({ productId: { $in: productIds }, isActive: true })
      .select('productId spocId')
      .lean()
      .exec();
  }

  /**
   * Distinct business `productId`s with an active SPOC allocation for the given staff user.
   */
  async findActiveProductIdsForSpoc(spocUserId: string): Promise<number[]> {
    const id = String(spocUserId ?? '').trim();
    if (!id || !Types.ObjectId.isValid(id)) {
      return [];
    }
    const rows = await this.allocationModel
      .find({ spocId: new Types.ObjectId(id), isActive: true })
      .select('productId')
      .lean()
      .exec();
    const ids = new Set<number>();
    for (const row of rows) {
      const productId = Number(row.productId);
      if (Number.isFinite(productId) && productId > 0) {
        ids.add(productId);
      }
    }
    return [...ids];
  }

  /**
   * True when the staff user has an active allocation on any of the given productIds.
   */
  async hasActiveAllocationForSpocOnProducts(
    spocUserId: string,
    productIds: number[],
  ): Promise<boolean> {
    const id = String(spocUserId ?? '').trim();
    const uniqueIds = [
      ...new Set(
        productIds
          .map((n) => Number(n))
          .filter((n) => Number.isFinite(n) && n > 0),
      ),
    ];
    if (!id || !Types.ObjectId.isValid(id) || uniqueIds.length === 0) {
      return false;
    }
    const found = await this.allocationModel
      .exists({
        spocId: new Types.ObjectId(id),
        isActive: true,
        productId: { $in: uniqueIds },
      })
      .exec();
    return !!found;
  }

  /**
   * Distinct business `productId`s with an active SPOC allocation for any of the given staff ids.
   */
  async findActiveProductIdsBySpocIds(spocUserIds: string[]): Promise<number[]> {
    const objectIds = [
      ...new Set(
        spocUserIds
          .map((id) => String(id ?? '').trim())
          .filter((id) => Types.ObjectId.isValid(id)),
      ),
    ].map((id) => new Types.ObjectId(id));
    if (!objectIds.length) {
      return [];
    }
    const rows = await this.allocationModel
      .find({ spocId: { $in: objectIds }, isActive: true })
      .select('productId')
      .lean()
      .exec();
    const ids = new Set<number>();
    for (const row of rows) {
      const productId = Number(row.productId);
      if (Number.isFinite(productId) && productId > 0) {
        ids.add(productId);
      }
    }
    return [...ids];
  }

  createAllocation(doc: {
    productId: number;
    urn: string;
    vendorId: Types.ObjectId;
    spocId: Types.ObjectId;
    assignedBy: Types.ObjectId;
    assignedAt: Date;
    updatedAt: Date;
    isActive: boolean;
  }) {
    return this.allocationModel.create(doc);
  }

  createHistory(doc: {
    allocationId: Types.ObjectId;
    previousSpoc: Types.ObjectId | null;
    newSpoc: Types.ObjectId;
    changedBy: Types.ObjectId;
    remarks: string;
    createdAt: Date;
    emailNotifiedAt: Date | null;
  }) {
    return this.historyModel.create(doc);
  }

  /**
   * Atomically claim the email slot for a history row.
   * Returns false if already claimed (prevents duplicate emails).
   */
  async claimHistoryEmailSlot(historyId: Types.ObjectId): Promise<boolean> {
    const claimed = await this.historyModel
      .findOneAndUpdate(
        {
          _id: historyId,
          $or: [
            { emailNotifiedAt: null },
            { emailNotifiedAt: { $exists: false } },
          ],
        },
        { $set: { emailNotifiedAt: new Date() } },
        { new: false },
      )
      .select('_id')
      .lean()
      .exec();
    return !!claimed;
  }
}
