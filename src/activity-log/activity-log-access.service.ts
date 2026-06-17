import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
} from '../product-registration/schemas/product.schema';
import { matchActiveProducts } from '../product-registration/constants/active-product.filter';
import {
  ActivityLogCaller,
  callerOrganizationId,
  isAdminPortalRole,
  isVendorPortalRole,
  normalizeUrnNo,
  urnCandidates,
} from './activity-log.util';

@Injectable()
export class ActivityLogAccessService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  private idsEqual(
    a?: Types.ObjectId | string | null,
    b?: Types.ObjectId | string | null,
  ): boolean {
    if (a == null || b == null) return false;
    return String(a) === String(b);
  }

  async assertUrnExists(urnNo: string): Promise<string> {
    const normalized = normalizeUrnNo(urnNo);
    if (!normalized) {
      throw new BadRequestException('URN number is required');
    }
    const options = urnCandidates(normalized);
    const product = await this.productModel
      .findOne(matchActiveProducts({ urnNo: { $in: options } }))
      .select('urnNo')
      .lean()
      .exec();
    if (!product) {
      throw new NotFoundException(`No products found for URN: ${normalized}`);
    }
    return normalizeUrnNo(String(product.urnNo ?? normalized));
  }

  async resolveMaxUrnWorkflowStatus(urnNo: string): Promise<number> {
    const normalized = normalizeUrnNo(urnNo);
    const options = urnCandidates(normalized);
    const rows = await this.productModel
      .find(matchActiveProducts({ urnNo: { $in: options } }))
      .select('urnStatus')
      .lean()
      .exec();
    let maxStatus = 0;
    for (const row of rows) {
      maxStatus = Math.max(maxStatus, Number(row.urnStatus ?? 0));
    }
    return maxStatus;
  }

  async assertCallerCanReadUrnLogs(
    urnNo: string,
    user?: ActivityLogCaller,
  ): Promise<string> {
    const normalized = await this.assertUrnExists(urnNo);
    const role = String(user?.role ?? user?.type ?? '').toLowerCase();

    if (isAdminPortalRole(role)) {
      return normalized;
    }

    if (!isVendorPortalRole(role)) {
      throw new ForbiddenException(
        'You do not have access to activity logs for this URN',
      );
    }

    const callerId = callerOrganizationId(user);
    if (!callerId) {
      throw new ForbiddenException(
        'Vendor organization ID not found in token',
      );
    }

    const callerObjectId = Types.ObjectId.isValid(callerId)
      ? new Types.ObjectId(callerId)
      : null;
    if (!callerObjectId) {
      throw new BadRequestException('Invalid vendor organization ID in token');
    }

    const options = urnCandidates(normalized);
    const product = await this.productModel
      .findOne(matchActiveProducts({ urnNo: { $in: options } }))
      .select('vendorId manufacturerId')
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException(`No products found for URN: ${normalized}`);
    }

    const ownsUrn =
      this.idsEqual(product.vendorId, callerObjectId) ||
      this.idsEqual(product.manufacturerId, callerObjectId);

    if (!ownsUrn) {
      throw new ForbiddenException(
        'You do not have access to activity logs for this URN',
      );
    }

    return normalized;
  }
}
